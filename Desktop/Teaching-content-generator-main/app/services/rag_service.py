from sentence_transformers import SentenceTransformer
import numpy as np
from services.transcript_service import fetch_transcript
from config import CHUNK_SIZE, CHUNK_OVERLAP, TOP_K, EMBEDDING_MODEL_NAME

# local simple RAG (no Pinecone yet)
model = SentenceTransformer(EMBEDDING_MODEL_NAME)

def chunk_text(text, chunk_size=CHUNK_SIZE, overlap=CHUNK_OVERLAP):
    chunks = []
    for i in range(0, len(text), chunk_size - overlap):
        chunks.append(text[i:i+chunk_size])
    return chunks

def retrieve_relevant_context(yt_link, query):
    transcript = fetch_transcript(yt_link)
    chunks = chunk_text(transcript)
    embeddings = model.encode(chunks)
    q_emb = model.encode([query])[0]
    scores = np.dot(embeddings, q_emb) / (np.linalg.norm(embeddings, axis=1) * np.linalg.norm(q_emb))
    top_idx = np.argsort(scores)[-TOP_K:][::-1]
    return "\n".join([chunks[i] for i in top_idx])

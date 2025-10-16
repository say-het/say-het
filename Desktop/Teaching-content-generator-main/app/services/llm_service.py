import google.generativeai as genai
from config import GOOGLE_API_KEY, LLM_MODEL_NAME

genai.configure(api_key=GOOGLE_API_KEY)

def generate_plan_from_llm(topic, yt_link):
    prompt = f"""
    You are an expert teacher. Create a clear and structured PowerPoint plan for the topic:
    "{topic}" using insights from the YouTube video at {yt_link}.
    The plan should include slide titles and short descriptions of what to cover.
    """
    model = genai.GenerativeModel(LLM_MODEL_NAME)
    response = model.generate_content(prompt)
    return response.text.strip()

def generate_content_from_plan(topic, plan, context):
    prompt = f"""
    Use the following plan and video transcript context to create full PowerPoint slide content.

    Topic: {topic}

    Plan:
    {plan}

    Transcript Context:
    {context}

    Generate: Slide titles + bullet points for each slide.
    """
    model = genai.GenerativeModel(LLM_MODEL_NAME)
    response = model.generate_content(prompt)
    return response.text.strip()

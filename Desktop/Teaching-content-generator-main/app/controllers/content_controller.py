from flask import request, jsonify
from services.llm_service import generate_content_from_plan
from services.rag_service import retrieve_relevant_context

def generate_content_controller():
    try:
        data = request.get_json()
        topic = data.get("topic")
        plan = data.get("plan")
        yt_link = data.get("youtube_link")

        if not all([topic, plan, yt_link]):
            return jsonify({"error": "Missing topic, plan or youtube_link"}), 400

        # get transcript context
        context = retrieve_relevant_context(yt_link, topic)
        # generate LLM content
        content = generate_content_from_plan(topic, plan, context)
        return jsonify({"slides": content})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

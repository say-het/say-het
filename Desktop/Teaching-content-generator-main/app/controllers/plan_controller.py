from flask import request, jsonify
from services.llm_service import generate_plan_from_llm

def generate_plan_controller():
    try:
        data = request.get_json()
        topic = data.get("topic")
        yt_link = data.get("youtube_link")

        if not topic or not yt_link:
            return jsonify({"error": "Missing topic or youtube_link"}), 400

        plan = generate_plan_from_llm(topic, yt_link)
        return jsonify({"plan": plan})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

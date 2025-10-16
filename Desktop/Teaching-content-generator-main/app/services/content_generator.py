# app/services/content_generator.py
import app.services.plan_generator as plan_service
import app.services.youtube as youtube_service
import app.services.llm_client as llm

def generate_content(plan_id: str | None = None, topic: str | None = None, youtube_url: str | None = None, options: dict | None = None) -> dict:
    """
    High-level content generation:
      - require plan_id OR topic
      - if plan_id -> fetch plan (should be finalized ideally)
      - fetch transcript if youtube_url provided
      - call llm to return slide content using plan + transcript (RAG)
    """
    if not plan_id and not topic:
        raise ValueError("Either plan_id or topic must be provided")

    plan = None
    if plan_id:
        plan = plan_service.get_plan(plan_id)
        if not plan:
            raise KeyError("plan not found")
    else:
        plan = plan_service.create_plan(topic=topic)

    transcript_text = None
    if youtube_url:
        try:
            tr = youtube_service.get_transcript(youtube_url)
            transcript_text = tr.get("text")
        except Exception as e:
            # transcript missing: continue but warn (do not fail entirely)
            transcript_text = None

    # Compose prompt for content generation
    plan_text = plan.get("raw_plan_text") or "\n".join([f"{i.get('title')}: {i.get('description')}" for i in plan.get("items", [])])
    prompt = llm.make_content_prompt(topic=plan.get("topic"), plan_text=plan_text, transcript_text=transcript_text, options=options)
    raw = llm.call_llm(prompt)

    # Try parse JSON response from LLM (our mock returns JSON string)
    import json
    slides = None
    try:
        slides = json.loads(raw).get("slides")
    except Exception:
        # fallback: return raw text under 'notes'
        slides = [{"title": "Generated (raw)", "bullet_points": [], "notes": raw}]

    return {
        "plan_id": plan.get("id"),
        "topic": plan.get("topic"),
        "slides": slides,
        "raw_llm": raw,
    }

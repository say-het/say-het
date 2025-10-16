from services.llm_client import LLMClient

class PlanService:
    def __init__(self):
        self.plans = []
        self.llm = LLMClient()

    def generate_plan(self, topic, link):
        """
        Ask Gemini to create a structured teaching plan or PPT outline
        for the given topic or YouTube video.
        """
        prompt = f"""
        You are an educational planner AI. Create a structured plan for a PowerPoint
        presentation or teaching session about:
        - Topic: {topic or 'N/A'}
        - YouTube Link: {link or 'N/A'}

        Include:
        1. Slide titles
        2. 3–5 bullet points per slide
        3. Approximate number of slides
        4. Logical flow of concepts
        """

        plan = self.llm.generate(prompt)
        self.plans.append(plan)
        return plan

    def get_all_plans(self):
        return self.plans

    def clear_plans(self):
        self.plans = []

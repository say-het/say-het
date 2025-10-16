from flask import Blueprint
from controllers.plan_controller import generate_plan_controller

plan_bp = Blueprint("plan_bp", __name__)

@plan_bp.route("/generate", methods=["POST"])
def generate_plan():
    return generate_plan_controller()

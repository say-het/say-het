from flask import Blueprint
from controllers.content_controller import generate_content_controller

content_bp = Blueprint("content_bp", __name__)

@content_bp.route("/generate", methods=["POST"])
def generate_content():
    return generate_content_controller()

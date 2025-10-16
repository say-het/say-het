from flask import Flask
from routes.plan_routes import plan_bp
from routes.content_routes import content_bp

app = Flask(__name__)

# Register Blueprints
app.register_blueprint(plan_bp, url_prefix="/api/plan")
app.register_blueprint(content_bp, url_prefix="/api/content")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)

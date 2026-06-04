from flask import render_template

from app.main import main_bp


@main_bp.route("/")
def index():
    return render_template("pages/home.html")


@main_bp.route("/ai-workflow")
def ai_workflow():
    return render_template("pages/ai-workflow.html")

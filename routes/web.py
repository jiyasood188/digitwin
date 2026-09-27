"""
routes/web.py - Web Frontend Routes
Campus Digital Twin
"""

from flask import Blueprint, render_template, current_app, send_from_directory
import os

web_bp = Blueprint("web", __name__)


@web_bp.route("/")
def index():
    """Render main digital twin dashboard."""
    return render_template("index.html")


@web_bp.route("/style.css")
def legacy_style():
    """Fallback route for direct requests to style.css."""
    return send_from_directory(os.path.join(current_app.static_folder, "css"), "style.css")


@web_bp.route("/script.js")
def legacy_script():
    """Fallback route for direct requests to script.js."""
    return send_from_directory(os.path.join(current_app.static_folder, "js"), "script.js")

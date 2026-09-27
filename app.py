"""
app.py - Flask Backend Application
Campus Digital Twin with MySQL Integration
"""

from flask import Flask
from config import Config
from routes import register_routes


def create_app(config_class=Config):
    """Application factory for Campus Digital Twin Flask app."""
    app = Flask(
        __name__,
        template_folder="templates",
        static_folder="static",
        static_url_path="/static"
    )
    app.config.from_object(config_class)

    # Enable CORS headers so frontend can communicate whether served by Flask or Live Server
    @app.after_request
    def add_cors_headers(response):
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
        return response

    # Register modular blueprints
    register_routes(app)

    return app


app = create_app()


if __name__ == "__main__":
    print(f"Starting Campus Digital Twin Backend on http://{Config.FLASK_HOST}:{Config.FLASK_PORT}")
    app.run(
        host=Config.FLASK_HOST,
        port=Config.FLASK_PORT,
        debug=Config.FLASK_DEBUG
    )

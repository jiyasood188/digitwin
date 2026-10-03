"""
routes/__init__.py - Route Blueprint Registry
Campus Digital Twin
"""

from routes.web import web_bp
from routes.system import system_bp
from routes.buildings import buildings_bp
from routes.telemetry import telemetry_bp
from routes.alerts import alerts_bp
from routes.operations import operations_bp
from routes.management import management_bp


def register_routes(app):
    """Register all modular blueprints onto the Flask application."""
    # Web views (index, static redirects)
    app.register_blueprint(web_bp)

    # API endpoints under /api prefix
    app.register_blueprint(system_bp, url_prefix="/api")
    app.register_blueprint(buildings_bp, url_prefix="/api")
    app.register_blueprint(telemetry_bp, url_prefix="/api")
    app.register_blueprint(alerts_bp, url_prefix="/api")
    app.register_blueprint(operations_bp, url_prefix="/api")
    app.register_blueprint(management_bp, url_prefix="/api")

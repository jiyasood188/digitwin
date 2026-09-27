"""
config.py - Application Configuration
Campus Digital Twin
"""

import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


class Config:
    """Base application configuration."""

    # Server Settings
    FLASK_HOST = os.getenv("FLASK_HOST", "0.0.0.0")
    FLASK_PORT = int(os.getenv("FLASK_PORT", 5000))
    FLASK_DEBUG = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1", "yes")
    SECRET_KEY = os.getenv("SECRET_KEY", "campus-digital-twin-secret-key")

    # Database Settings
    DB_HOST = os.getenv("DB_HOST", "127.0.0.1")
    DB_PORT = int(os.getenv("DB_PORT", 3306))
    DB_USER = os.getenv("DB_USER", "digiuser")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "digipass")
    DB_NAME = os.getenv("DB_NAME", "digicampus")


class DevelopmentConfig(Config):
    """Development environment configuration."""
    DEBUG = True


class ProductionConfig(Config):
    """Production environment configuration."""
    DEBUG = False

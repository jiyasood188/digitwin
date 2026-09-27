"""
routes/system.py - System & Health REST APIs
Campus Digital Twin
"""

from datetime import datetime
from flask import Blueprint, jsonify
import db

system_bp = Blueprint("system", __name__)


@system_bp.route("/health", methods=["GET"])
def health_check():
    """Health status and database connectivity check."""
    db_status = db.check_db_connection()
    return jsonify({
        "status": "online",
        "service": "Campus Digital Twin Backend",
        "timestamp": datetime.now().isoformat(),
        "database": db_status
    })


@system_bp.route("/stats", methods=["GET"])
def get_campus_stats():
    """Return campus summary stats from MySQL."""
    try:
        rows = db.execute_query("SELECT stat_key, stat_value, unit, description FROM campus_stats;")
        stats_dict = {r["stat_key"]: r["stat_value"] for r in rows}
        return jsonify({
            "success": True,
            "stats": stats_dict
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

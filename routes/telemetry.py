"""
routes/telemetry.py - Energy, Occupancy & IoT Sensors Telemetry APIs
Campus Digital Twin
"""

import random
from datetime import datetime
from flask import Blueprint, jsonify, request
import db

telemetry_bp = Blueprint("telemetry", __name__)


@telemetry_bp.route("/energy", methods=["GET"])
def get_energy_data():
    """Return energy dashboard analytics."""
    try:
        buildings = db.execute_query(
            "SELECT name, energy_kw, status FROM buildings WHERE name LIKE %s ORDER BY id ASC;",
            ("Block %",)
        )

        weekly_chart = [
            {"day": "Mon", "value": 90, "class": ""},
            {"day": "Tue", "value": 130, "class": ""},
            {"day": "Wed", "value": 170, "class": "high"},
            {"day": "Thu", "value": 110, "class": ""},
            {"day": "Fri", "value": 190, "class": "peak"},
            {"day": "Sat", "value": 100, "class": ""},
            {"day": "Sun", "value": 70, "class": "low"}
        ]

        return jsonify({
            "success": True,
            "summary": {
                "total_consumption": "324 kWh",
                "delta_yesterday": "+4.2%",
                "solar_production": "98 kWh",
                "peak_load": "42 kW",
                "peak_location": "Block 3",
                "efficiency": "91%",
                "rating": "Excellent"
            },
            "weekly_usage": weekly_chart,
            "buildings": buildings
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@telemetry_bp.route("/occupancy", methods=["GET"])
def get_occupancy_data():
    """Return occupancy dashboard analytics."""
    try:
        buildings = db.execute_query(
            "SELECT name, occupancy, status FROM buildings WHERE name LIKE %s ORDER BY id ASC;",
            ("Block %",)
        )

        return jsonify({
            "success": True,
            "summary": {
                "people_on_campus": "2,846",
                "occupied_buildings": "16 / 18",
                "peak_zone": "Library & Tech Wing",
                "average_dwell_time": "3.8 hrs"
            },
            "buildings": buildings
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@telemetry_bp.route("/sensors", methods=["GET"])
def get_sensors():
    """Return live sensor readings and stats summary."""
    try:
        status_filter = request.args.get("status")
        if status_filter:
            sensors = db.execute_query(
                "SELECT * FROM sensors WHERE status = %s ORDER BY id ASC;",
                (status_filter,)
            )
        else:
            sensors = db.execute_query("SELECT * FROM sensors ORDER BY id ASC;")

        counts = db.execute_one("""
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) AS active,
                SUM(CASE WHEN status = 'warning' THEN 1 ELSE 0 END) AS warning,
                SUM(CASE WHEN status = 'offline' THEN 1 ELSE 0 END) AS offline
            FROM sensors;
        """)

        return jsonify({
            "success": True,
            "counts": counts,
            "sensors": sensors
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@telemetry_bp.route("/sensors/refresh", methods=["POST"])
def refresh_sensor_telemetry():
    """Simulate a sensor update cycle in MySQL."""
    try:
        temp_val = round(21.0 + random.uniform(0.5, 3.5), 1)
        pwr_val = round(16.0 + random.uniform(1.0, 5.0), 1)

        db.execute_commit(
            "UPDATE sensors SET reading_value = %s, last_updated = CURRENT_TIMESTAMP WHERE type = 'temperature' LIMIT 1;",
            (str(temp_val),)
        )
        db.execute_commit(
            "UPDATE sensors SET reading_value = %s, last_updated = CURRENT_TIMESTAMP WHERE type = 'energy' LIMIT 1;",
            (str(pwr_val),)
        )

        return jsonify({
            "success": True,
            "message": "Sensor telemetry updated successfully in MySQL",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

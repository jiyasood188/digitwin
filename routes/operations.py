"""
routes/operations.py - Operations, Bookings, Parking & Settings REST APIs
Campus Digital Twin
"""

import random
from datetime import datetime
from flask import Blueprint, jsonify, request
import db

operations_bp = Blueprint("operations", __name__)


@operations_bp.route("/settings", methods=["GET"])
def get_settings():
    """Fetch all dashboard configuration settings from MySQL."""
    try:
        rows = db.execute_query("SELECT setting_key, setting_value FROM dashboard_settings;")
        settings_dict = {}
        for r in rows:
            val = r["setting_value"]
            if val.lower() == "true":
                settings_dict[r["setting_key"]] = True
            elif val.lower() == "false":
                settings_dict[r["setting_key"]] = False
            else:
                settings_dict[r["setting_key"]] = val

        return jsonify({
            "success": True,
            "settings": settings_dict
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@operations_bp.route("/settings", methods=["POST"])
def save_settings():
    """Persist updated dashboard configuration settings into MySQL."""
    try:
        data = request.get_json() or {}
        if not data:
            return jsonify({"success": False, "error": "No settings payload provided"}), 400

        for key, value in data.items():
            str_val = str(value).lower() if isinstance(value, bool) else str(value)
            db.execute_commit("""
                INSERT INTO dashboard_settings (setting_key, setting_value)
                VALUES (%s, %s)
                ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value);
            """, (key, str_val))

        return jsonify({
            "success": True,
            "message": "Settings saved successfully in MySQL.",
            "timestamp": datetime.now().isoformat()
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@operations_bp.route("/bookings", methods=["GET", "POST"])
def manage_bookings():
    """List or create campus room bookings."""
    if request.method == "POST":
        try:
            data = request.get_json() or {}
            room_id = data.get("room_id", 1)
            title = data.get("title", "Meeting")
            booked_by_name = data.get("booked_by_name", "Staff")
            booked_by_email = data.get("booked_by_email", "staff@campus.edu")
            booking_date = data.get("booking_date", datetime.today().strftime('%Y-%m-%d'))
            start_time = data.get("start_time", "14:00:00")
            end_time = data.get("end_time", "15:00:00")
            qr_token = f"TOKEN-{random.randint(10000, 99999)}"

            res = db.execute_commit("""
                INSERT INTO bookings (room_id, title, booked_by_name, booked_by_email, booking_date, start_time, end_time, qr_token, status)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'CONFIRMED');
            """, (room_id, title, booked_by_name, booked_by_email, booking_date, start_time, end_time, qr_token))

            return jsonify({"success": True, "booking_id": res["last_id"], "qr_token": qr_token}), 201
        except Exception as e:
            return jsonify({"success": False, "error": str(e)}), 500

    # GET
    try:
        bookings = db.execute_query("""
            SELECT b.id, b.title, b.booked_by_name, b.booking_date, b.start_time, b.end_time, b.status, r.name AS room_name
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            ORDER BY b.booking_date DESC, b.start_time ASC;
        """)
        for b in bookings:
            for field in ["booking_date", "start_time", "end_time"]:
                if b.get(field) is not None:
                    b[field] = str(b[field])
        return jsonify({"success": True, "bookings": bookings})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@operations_bp.route("/parking", methods=["GET"])
def get_parking():
    """Return parking zones and live availability."""
    try:
        zones = db.execute_query("""
            SELECT z.id, z.name, z.code, z.total_slots,
                   SUM(CASE WHEN s.is_occupied = 1 THEN 1 ELSE 0 END) AS occupied_slots,
                   (z.total_slots - SUM(CASE WHEN s.is_occupied = 1 THEN 1 ELSE 0 END)) AS available_slots
            FROM parking_zones z
            LEFT JOIN parking_slots s ON z.id = s.zone_id
            GROUP BY z.id, z.name, z.code, z.total_slots;
        """)
        return jsonify({
            "success": True,
            "zones": zones
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

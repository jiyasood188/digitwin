"""
routes/operations.py - Operations, Bookings, Parking & Settings REST APIs
Campus Digital Twin
"""

import random
import uuid
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

    # CREATE BOOKING
    if request.method == "POST":
        data = request.get_json() or {}

        user_id = data.get("user_id")
        room_id = data.get("room_id")
        booking_date = data.get("booking_date")
        start_time = data.get("start_time")
        end_time = data.get("end_time")
        status = data.get("status", "confirmed")

        if not all([
            user_id,
            room_id,
            booking_date,
            start_time,
            end_time
        ]):
            return jsonify({
                "error": "user_id, room_id, booking_date, start_time and end_time are required"
            }), 400

        # Check user
        user = db.execute_one(
            "SELECT id FROM users WHERE id = %s",
            (user_id,)
        )

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Check room
        room = db.execute_one(
            "SELECT id FROM rooms WHERE id = %s",
            (room_id,)
        )

        if not room:
            return jsonify({"error": "Room not found"}), 404

        # Unique QR token
        qr_token = uuid.uuid4().hex

        result = db.execute_commit(
            """
            INSERT INTO bookings
            (user_id, room_id, booking_date, start_time, end_time, status, qr_token)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (
                user_id,
                room_id,
                booking_date,
                start_time,
                end_time,
                status,
                qr_token
            )
        )

        return jsonify({
            "status": "success",
            "message": "Booking created",
            "booking_id": result["last_id"],
            "qr_token": qr_token
        }), 201

    # GET BOOKINGS
    query = """
        SELECT
            b.id,
            b.user_id,
            u.name AS user_name,
            b.room_id,
            r.room_number,
            b.booking_date,
            b.start_time,
            b.end_time,
            b.status,
            b.qr_token
        FROM bookings b
        JOIN users u ON b.user_id = u.id
        JOIN rooms r ON b.room_id = r.id
        ORDER BY b.booking_date DESC, b.start_time DESC
    """

    bookings = db.execute_query(query)

    return jsonify({
        "status": "success",
        "bookings": bookings
    })
@operations_bp.route("/parking", methods=["GET"])
def get_parking():

    query = """
        SELECT
            pa.id AS area_id,
            pa.area_name,
            pa.location,
            COUNT(ps.id) AS total_slots,
            SUM(
                CASE
                    WHEN ps.status = 'occupied' THEN 1
                    ELSE 0
                END
            ) AS occupied_slots,
            SUM(
                CASE
                    WHEN ps.status = 'available' THEN 1
                    ELSE 0
                END
            ) AS available_slots
        FROM parking_areas pa
        LEFT JOIN parking_slots ps
            ON pa.id = ps.area_id
        GROUP BY
            pa.id,
            pa.area_name,
            pa.location
        ORDER BY pa.area_name
    """

    parking = db.execute_query(query)

    return jsonify({
        "status": "success",
        "parking": parking
    })
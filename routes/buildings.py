"""
routes/buildings.py - Buildings & 3D Digital Twin APIs
Campus Digital Twin
"""

from flask import Blueprint, jsonify
import db

buildings_bp = Blueprint("buildings", __name__)


@buildings_bp.route("/buildings", methods=["GET"])
def get_buildings():
    """Return list of all campus buildings and 3D twin mapping."""
    try:
        buildings = db.execute_query("""
            SELECT id, code, name, type, total_floors, occupancy, energy_kw, active_sensors, status, description, color, pos_x, pos_y
            FROM buildings
            ORDER BY id ASC;
        """)

        # Generate 3D campus twin mapping
        twin_3d = {
            "building-a": {
                "name": "Block 1",
                "type": "Academic Block",
                "occupancy": "420 students",
                "energy": "18.6 kW",
                "sensors": "52 active",
                "status": "Normal"
            },
            "building-b": {
                "name": "Block 2",
                "type": "Academic Block",
                "occupancy": "385 students",
                "energy": "16.9 kW",
                "sensors": "48 active",
                "status": "Normal"
            },
            "building-c": {
                "name": "Block 3",
                "type": "Academic Block",
                "occupancy": "510 students",
                "energy": "22.4 kW",
                "sensors": "61 active",
                "status": "Attention"
            }
        }

        # Override 3D data with live values from buildings table if found
        for b in buildings:
            if b["name"] == "Block 1":
                twin_3d["building-a"]["occupancy"] = f"{b['occupancy']} students"
                twin_3d["building-a"]["energy"] = f"{b['energy_kw']} kW"
                twin_3d["building-a"]["sensors"] = f"{b['active_sensors']} active"
                twin_3d["building-a"]["status"] = b["status"]
            elif b["name"] == "Block 2":
                twin_3d["building-b"]["occupancy"] = f"{b['occupancy']} students"
                twin_3d["building-b"]["energy"] = f"{b['energy_kw']} kW"
                twin_3d["building-b"]["sensors"] = f"{b['active_sensors']} active"
                twin_3d["building-b"]["status"] = b["status"]
            elif b["name"] == "Block 3":
                twin_3d["building-c"]["occupancy"] = f"{b['occupancy']} students"
                twin_3d["building-c"]["energy"] = f"{b['energy_kw']} kW"
                twin_3d["building-c"]["sensors"] = f"{b['active_sensors']} active"
                twin_3d["building-c"]["status"] = b["status"]

        return jsonify({
            "success": True,
            "buildings": buildings,
            "twin_3d": twin_3d
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@buildings_bp.route("/buildings/<string:building_identifier>/rooms", methods=["GET"])
def get_building_rooms(building_identifier):
    """Return rooms for a given building ID or building name."""
    try:
        if building_identifier.isdigit():
            bld = db.execute_one("""
                SELECT id, code, name, type, total_floors, occupancy, energy_kw,
                       active_sensors, status, description
                FROM buildings
                WHERE id = %s;
            """, (int(building_identifier),))
        else:
            bld = db.execute_one("""
                SELECT id, code, name, type, total_floors, occupancy, energy_kw,
                       active_sensors, status, description
                FROM buildings
                WHERE name = %s;
            """, (building_identifier,))

        if not bld:
            return jsonify({"success": False, "error": "Building not found"}), 404

        rooms = db.execute_query("""
            SELECT r.id, r.room_number, r.name, r.type, r.capacity, r.current_occupancy,
                   f.floor_number, f.name AS floor_name,
                   r.has_projector, r.has_ac, r.has_smartboard,
                   COUNT(s.id) AS schedule_count
            FROM rooms r
            LEFT JOIN floors f ON f.id = r.floor_id
            LEFT JOIN schedules s ON r.id = s.room_id
            WHERE r.building_id = %s
            GROUP BY r.id, r.room_number, r.name, r.type, r.capacity, r.current_occupancy,
                     f.floor_number, f.name, r.has_projector, r.has_ac, r.has_smartboard
            ORDER BY r.room_number ASC;
        """, (bld["id"],))

        room_types = [(room.get("type") or "").lower() for room in rooms]
        bld["room_count"] = sum("lab" not in room_type and "library" not in room_type for room_type in room_types)
        bld["lab_count"] = sum("lab" in room_type for room_type in room_types)
        bld["library_count"] = sum("library" in room_type for room_type in room_types)

        return jsonify({
            "success": True,
            "building": bld["name"],
            "building_details": bld,
            "rooms": rooms
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@buildings_bp.route("/rooms/<string:building_name>/<string:room_name>/timetable", methods=["GET"])
def get_room_timetable(building_name, room_name):
    """Return schedule/timetable for a specific room."""
    try:
        room_record = db.execute_one("""
            SELECT r.id, r.room_number, r.name, b.name AS building_name
            FROM rooms r
            JOIN buildings b ON r.building_id = b.id
            WHERE b.name = %s AND (r.room_number = %s OR r.name LIKE %s);
        """, (building_name, room_name, f"%{room_name}%"))

        if not room_record:
            return jsonify({"success": False, "error": "Room not found"}), 404

        schedules = db.execute_query("""
            SELECT time_slot, title, instructor, type
            FROM schedules
            WHERE room_id = %s
            ORDER BY start_time ASC;
        """, (room_record["id"],))

        timetable_list = [[s["time_slot"], s["title"], s["instructor"] or "Staff"] for s in schedules]

        return jsonify({
            "success": True,
            "building": building_name,
            "room": room_name,
            "timetable": timetable_list
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@buildings_bp.route("/all-rooms-data", methods=["GET"])
def get_all_rooms_data():
    """Return entire roomData timetable tree compatible with frontend script.js."""
    try:
        rows = db.execute_query("""
            SELECT b.name AS building_name, r.room_number, s.time_slot, s.title, s.instructor
            FROM buildings b
            JOIN rooms r ON b.id = r.building_id
            JOIN schedules s ON r.id = s.room_id
            ORDER BY b.name, r.room_number, s.start_time;
        """)

        room_data = {}
        for row in rows:
            b_name = row["building_name"]
            r_num = row["room_number"]
            if b_name not in room_data:
                room_data[b_name] = {}
            if r_num not in room_data[b_name]:
                room_data[b_name][r_num] = []
            room_data[b_name][r_num].append([
                row["time_slot"],
                row["title"],
                row["instructor"] or "Staff"
            ])

        return jsonify({
            "success": True,
            "roomData": room_data
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

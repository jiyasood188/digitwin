from flask import Blueprint, request, jsonify
from db import execute_query, execute_one, execute_commit

management_bp = Blueprint("management", __name__)


# =========================
# ROOM MANAGEMENT
# =========================

@management_bp.route("/rooms", methods=["GET"])
def get_rooms():
    query = """
        SELECT 
            r.id,
            r.building_id,
            r.floor_id,
            r.room_number,
            r.name,
            r.type,
            r.capacity,
            r.current_occupancy,
            b.name AS building_name,
            f.floor_number
        FROM rooms r
        JOIN buildings b ON r.building_id = b.id
        JOIN floors f ON r.floor_id = f.id
        ORDER BY b.name, f.floor_number, r.room_number
    """

    rooms = execute_query(query)

    return jsonify({
        "status": "success",
        "rooms": rooms
    })


@management_bp.route("/rooms/<int:room_id>", methods=["GET"])
def get_room(room_id):
    query = """
        SELECT 
            r.id,
            r.building_id,
            r.floor_id,
            r.room_number,
            r.name,
            r.type,
            r.capacity,
            r.current_occupancy,
            b.name AS building_name,
            f.floor_number
        FROM rooms r
        JOIN buildings b ON r.building_id = b.id
        JOIN floors f ON r.floor_id = f.id
        WHERE r.id = %s
    """

    room = execute_one(query, (room_id,))

    if not room:
        return jsonify({"error": "Room not found"}), 404

    return jsonify({
        "status": "success",
        "room": room
    })
@management_bp.route("/rooms", methods=["POST"])
def add_room():

    data = request.get_json() or {}

    building_id = data.get("building_id")
    floor_id = data.get("floor_id")
    room_number = data.get("room_number")
    name = data.get("name")
    room_type = data.get("type", "Lecture Room")
    capacity = data.get("capacity", 45)

    if not all([building_id, floor_id, room_number]):
        return jsonify({
            "error": "building_id, floor_id and room_number are required"
        }), 400

    # Check building
    building = execute_one(
        "SELECT id FROM buildings WHERE id = %s",
        (building_id,)
    )

    if not building:
        return jsonify({"error": "Building not found"}), 404

    # Check floor
    floor = execute_one(
        """
        SELECT id
        FROM floors
        WHERE id = %s AND building_id = %s
        """,
        (floor_id, building_id)
    )

    if not floor:
        return jsonify({
            "error": "Floor not found for this building"
        }), 404

    # Check duplicate room number
    existing = execute_one(
        """
        SELECT id
        FROM rooms
        WHERE building_id = %s AND room_number = %s
        """,
        (building_id, room_number)
    )

    if existing:
        return jsonify({
            "error": "Room already exists in this building"
        }), 409

    result = execute_commit(
        """
        INSERT INTO rooms
        (building_id, floor_id, room_number, name, type, capacity)
        VALUES (%s, %s, %s, %s, %s, %s)
        """,
        (
            building_id,
            floor_id,
            room_number,
            name,
            room_type,
            capacity
        )
    )

    return jsonify({
        "status": "success",
        "message": "Room added",
        "room_id": result["last_id"]
    }), 201

@management_bp.route("/rooms/<int:room_id>", methods=["PUT"])
def update_room(room_id):

    data = request.get_json() or {}

    name = data.get("name")
    room_type = data.get("type")
    capacity = data.get("capacity")

    existing = execute_one(
        "SELECT id FROM rooms WHERE id = %s",
        (room_id,)
    )

    if not existing:
        return jsonify({
            "error": "Room not found"
        }), 404

    execute_commit(
        """
        UPDATE rooms
        SET name = %s,
            type = %s,
            capacity = %s
        WHERE id = %s
        """,
        (name, room_type, capacity, room_id)
    )

    return jsonify({
        "status": "success",
        "message": "Room updated"
    })


# =========================
# EQUIPMENT MANAGEMENT
# =========================

@management_bp.route("/equipment", methods=["GET"])
def get_equipment():
    query = """
        SELECT
            e.id,
            e.room_id,
            e.equipment_name,
            e.quantity,
            e.status,
            r.room_number
        FROM equipment e
        JOIN rooms r ON e.room_id = r.id
        ORDER BY r.room_number, e.equipment_name
    """

    equipment = execute_query(query)

    return jsonify({
        "status": "success",
        "equipment": equipment
    })


@management_bp.route("/equipment", methods=["POST"])
def add_equipment():
    data = request.get_json() or {}

    room_id = data.get("room_id")
    equipment_name = data.get("equipment_name")
    quantity = data.get("quantity")
    status = data.get("status")

    if not all([room_id, equipment_name, quantity, status]):
        return jsonify({
            "error": "room_id, equipment_name, quantity and status are required"
        }), 400

    result = execute_commit(
        """
        INSERT INTO equipment
        (room_id, equipment_name, quantity, status)
        VALUES (%s, %s, %s, %s)
        """,
        (room_id, equipment_name, quantity, status)
    )

    return jsonify({
        "status": "success",
        "message": "Equipment added",
        "equipment_id": result["last_id"]
    }), 201

@management_bp.route("/equipment/<int:equipment_id>", methods=["PUT"])
def update_equipment(equipment_id):

    data = request.get_json() or {}

    equipment_name = data.get("equipment_name")
    quantity = data.get("quantity")
    status = data.get("status")

    existing = execute_one(
        """
        SELECT id
        FROM equipment
        WHERE id = %s
        """,
        (equipment_id,)
    )

    if not existing:
        return jsonify({
            "error": "Equipment not found"
        }), 404

    execute_commit(
        """
        UPDATE equipment
        SET equipment_name = %s,
            quantity = %s,
            status = %s
        WHERE id = %s
        """,
        (
            equipment_name,
            quantity,
            status,
            equipment_id
        )
    )

    return jsonify({
        "status": "success",
        "message": "Equipment updated"
    })

@management_bp.route("/equipment/<int:equipment_id>", methods=["DELETE"])
def delete_equipment(equipment_id):

    existing = execute_one(
        """
        SELECT id
        FROM equipment
        WHERE id = %s
        """,
        (equipment_id,)
    )

    if not existing:
        return jsonify({
            "error": "Equipment not found"
        }), 404

    execute_commit(
        """
        DELETE FROM equipment
        WHERE id = %s
        """,
        (equipment_id,)
    )

    return jsonify({
        "status": "success",
        "message": "Equipment deleted"
    })


# =========================
# CLASSROOM SCHEDULES
# =========================

@management_bp.route("/schedules", methods=["GET"])
def get_schedules():
    query = """
        SELECT
            s.id,
            s.room_id,
            r.room_number,
            s.title,
            s.instructor,
            s.type,
            s.time_slot,
            s.start_time,
            s.end_time,
            s.day_of_week
        FROM schedules s
        JOIN rooms r ON s.room_id = r.id
        ORDER BY s.day_of_week, s.start_time
    """

    schedules = execute_query(query)

    return jsonify({
        "status": "success",
        "schedules": schedules
    })


@management_bp.route("/schedules", methods=["POST"])
def add_schedule():
    data = request.get_json() or {}

    room_id = data.get("room_id")
    title = data.get("title")
    instructor = data.get("instructor")
    schedule_type = data.get("type", "lecture")
    time_slot = data.get("time_slot")
    start_time = data.get("start_time")
    end_time = data.get("end_time")
    day_of_week = data.get("day_of_week")

    if not all([
        room_id,
        title,
        time_slot,
        start_time,
        end_time,
        day_of_week
    ]):
        return jsonify({
            "error": "Required schedule fields are missing"
        }), 400

    result = execute_commit(
        """
        INSERT INTO schedules
        (room_id, title, instructor, type, time_slot,
         start_time, end_time, day_of_week)
        VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
        """,
        (
            room_id,
            title,
            instructor,
            schedule_type,
            time_slot,
            start_time,
            end_time,
            day_of_week
        )
    )

    return jsonify({
        "status": "success",
        "message": "Schedule added",
        "schedule_id": result["last_id"]
    }), 201

@management_bp.route("/bookings/qr/<qr_token>", methods=["GET"])
def verify_qr(qr_token):

    query = """
        SELECT
            b.id AS booking_id,
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
        WHERE b.qr_token = %s
    """

    booking = execute_one(query, (qr_token,))

    if not booking:
        return jsonify({
            "status": "error",
            "message": "Invalid QR token"
        }), 404

    return jsonify({
        "status": "success",
        "booking": booking
    })


# =========================
# QR CHECK-IN
# =========================
@management_bp.route("/checkins", methods=["POST"])
def checkin():

    data = request.get_json() or {}

    qr_token = data.get("qr_token")

    if not qr_token:
        return jsonify({
            "error": "qr_token is required"
        }), 400

    booking = execute_one(
        """
        SELECT id, user_id, status
        FROM bookings
        WHERE qr_token = %s
        """,
        (qr_token,)
    )

    if not booking:
        return jsonify({
            "error": "Invalid QR token"
        }), 404

    # Check if already checked in
    existing = execute_one(
        """
        SELECT id
        FROM checkins
        WHERE booking_id = %s
        AND checkout_time IS NULL
        """,
        (booking["id"],)
    )

    if existing:
        return jsonify({
            "error": "Already checked in"
        }), 400

    result = execute_commit(
        """
        INSERT INTO checkins
        (booking_id, user_id, checkin_time)
        VALUES (%s, %s, NOW())
        """,
        (
            booking["id"],
            booking["user_id"]
        )
    )

    return jsonify({
        "status": "success",
        "message": "QR check-in successful",
        "checkin_id": result["last_id"],
        "booking_id": booking["id"]
    }), 201


@management_bp.route("/checkins/<int:checkin_id>/checkout", methods=["POST"])
def checkout(checkin_id):

    checkin = execute_one(
        """
        SELECT id
        FROM checkins
        WHERE id = %s
        """,
        (checkin_id,)
    )

    if not checkin:
        return jsonify({"error": "Check-in not found"}), 404

    execute_commit(
        """
        UPDATE checkins
        SET checkout_time = NOW()
        WHERE id = %s
        """,
        (checkin_id,)
    )

    return jsonify({
        "status": "success",
        "message": "Checkout successful"
    })
# =========================
# PARKING MANAGEMENT
# =========================

@management_bp.route("/parking/slots", methods=["GET"])
def get_parking_slots():

    query = """
        SELECT
            ps.id,
            ps.area_id,
            pa.area_name,
            pa.location,
            ps.slot_number,
            ps.status
        FROM parking_slots ps
        JOIN parking_areas pa
            ON ps.area_id = pa.id
        ORDER BY pa.area_name, ps.slot_number
    """

    slots = execute_query(query)

    return jsonify({
        "status": "success",
        "parking_slots": slots
    })
@management_bp.route("/parking/slots/<int:slot_id>", methods=["PUT"])
def update_parking_slot(slot_id):

    data = request.get_json() or {}
    status = data.get("status")

    if status not in ["available", "occupied"]:
        return jsonify({
            "error": "Status must be available or occupied"
        }), 400

    existing = execute_one(
        """
        SELECT id
        FROM parking_slots
        WHERE id = %s
        """,
        (slot_id,)
    )

    if not existing:
        return jsonify({
            "error": "Parking slot not found"
        }), 404

    execute_commit(
        """
        UPDATE parking_slots
        SET status = %s
        WHERE id = %s
        """,
        (status, slot_id)
    )

    return jsonify({
        "status": "success",
        "message": "Parking slot updated"
    })
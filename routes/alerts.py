"""
routes/alerts.py - Alerts Management REST APIs
Campus Digital Twin
"""

from flask import Blueprint, jsonify, request
import db

alerts_bp = Blueprint("alerts", __name__)


@alerts_bp.route("/alerts", methods=["GET"])
def get_alerts():
    """Return campus alerts list and statistics."""
    try:
        severity = request.args.get("severity")
        status = request.args.get("status")

        query = "SELECT * FROM alerts WHERE 1=1"
        params = []
        if severity:
            query += " AND severity = %s"
            params.append(severity)
        if status:
            query += " AND status = %s"
            params.append(status)

        query += " ORDER BY CASE WHEN status = 'active' THEN 1 ELSE 2 END, created_at DESC;"

        alerts = db.execute_query(query, params)

        stats = db.execute_one("""
            SELECT 
                COUNT(*) AS total,
                SUM(CASE WHEN severity = 'critical' AND status != 'dismissed' THEN 1 ELSE 0 END) AS critical,
                SUM(CASE WHEN severity = 'warning' AND status != 'dismissed' THEN 1 ELSE 0 END) AS warning,
                SUM(CASE WHEN status = 'resolved' THEN 1 ELSE 0 END) AS resolved
            FROM alerts;
        """)

        return jsonify({
            "success": True,
            "stats": stats,
            "alerts": alerts
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@alerts_bp.route("/alerts/<int:alert_id>/dismiss", methods=["POST"])
def dismiss_alert(alert_id):
    """Mark an alert as dismissed in MySQL."""
    try:
        res = db.execute_commit(
            "UPDATE alerts SET status = 'dismissed' WHERE id = %s;",
            (alert_id,)
        )
        if res["affected_rows"] == 0:
            return jsonify({"success": False, "error": "Alert not found"}), 404
        return jsonify({
            "success": True,
            "message": f"Alert {alert_id} dismissed in MySQL."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@alerts_bp.route("/alerts/<int:alert_id>/resolve", methods=["POST"])
def resolve_alert(alert_id):
    """Mark an alert as resolved in MySQL."""
    try:
        res = db.execute_commit(
            "UPDATE alerts SET status = 'resolved', severity = 'resolved', resolved_at = CURRENT_TIMESTAMP WHERE id = %s;",
            (alert_id,)
        )
        if res["affected_rows"] == 0:
            return jsonify({"success": False, "error": "Alert not found"}), 404
        return jsonify({
            "success": True,
            "message": f"Alert {alert_id} resolved in MySQL."
        })
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500


@alerts_bp.route("/alerts", methods=["POST"])
def create_alert():
    """Create a new alert in MySQL."""
    try:
        data = request.get_json() or {}
        title = data.get("title")
        if not title:
            return jsonify({"success": False, "error": "Title is required"}), 400

        severity = data.get("severity", "warning")
        category = data.get("category", "General")
        location = data.get("location", "Campus")
        description = data.get("description", "")

        res = db.execute_commit("""
            INSERT INTO alerts (title, severity, status, category, location, description)
            VALUES (%s, %s, 'active', %s, %s, %s);
        """, (title, severity, category, location, description))

        return jsonify({
            "success": True,
            "alert_id": res["last_id"],
            "message": "Alert created successfully in MySQL."
        }), 201
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

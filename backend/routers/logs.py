from flask import Blueprint, jsonify
from database import SessionLocal
from models import Log

logs_bp = Blueprint("logs", __name__)

@logs_bp.route("/logs", methods=["GET"])
def get_logs():
    db = SessionLocal()
    try:
        logs = db.query(Log).all()
        result = [
            {
                "id": l.id,
                "user_id": l.user_id,
                "campaign_id": l.campaign_id,
                "result": l.result,
                "action_time": l.action_time.isoformat(),
                "ip": l.ip,
                "device": l.device
            }
            for l in logs
        ]
        return jsonify(result)
    finally:
        db.close()

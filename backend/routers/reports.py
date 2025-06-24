from flask import Blueprint, jsonify
from database import SessionLocal
from models import Log
from sqlalchemy import func

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/reports/top-users", methods=["GET"])
def top_users():
    db = SessionLocal()
    try:
        results = (
            db.query(Log.user_id, Log.campaign_id, func.count().label("count"))
            .group_by(Log.user_id, Log.campaign_id)
            .order_by(func.count().desc())
            .limit(10)
            .all()
        )
        data = [{"user_id": r.user_id, "campaign_id": r.campaign_id, "count": r.count} for r in results]
        return jsonify(data)
    finally:
        db.close()

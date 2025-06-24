from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Campaign
from datetime import datetime

campaigns_bp = Blueprint("campaigns", __name__)

@campaigns_bp.route("/campaigns", methods=["POST"])
def create_campaign():
    db = SessionLocal()
    try:
        data = request.get_json()
        campaign = Campaign(
            user_id=data["user_id"],
            type=data["type"],
            subtype=data["subtype"],
            keywords=data["keywords"],
            rank_keyword=data["rank_keyword"],
            link=data["link"],
            start_date=datetime.fromisoformat(data["start_date"]),
            end_date=datetime.fromisoformat(data["end_date"]),
            quantity=data["quantity"]
        )
        db.add(campaign)
        db.commit()
        db.refresh(campaign)
        return jsonify({"message": "created", "id": campaign.id})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@campaigns_bp.route("/campaigns", methods=["GET"])
def get_campaigns():
    db = SessionLocal()
    try:
        campaigns = db.query(Campaign).all()
        return jsonify([{
            "id": c.id,
            "user_id": c.user_id,
            "type": c.type,
            "subtype": c.subtype,
            "keywords": c.keywords,
            "rank_keyword": c.rank_keyword,
            "link": c.link,
            "start_date": c.start_date.isoformat(),
            "end_date": c.end_date.isoformat(),
            "quantity": c.quantity,
            "created_at": c.created_at.isoformat()
        } for c in campaigns])
    finally:
        db.close()

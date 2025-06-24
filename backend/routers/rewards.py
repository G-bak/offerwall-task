from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Reward, RewardStatus
from datetime import datetime, timezone

rewards_bp = Blueprint("rewards", __name__)

@rewards_bp.route("/rewards/pay", methods=["POST"])
def pay_reward():
    db = SessionLocal()
    try:
        log_id = request.get_json()["log_id"]
        reward = Reward(log_id=log_id, status=RewardStatus.paid, paid_at=datetime.now(timezone.utc))
        db.add(reward)
        db.commit()
        db.refresh(reward)
        return jsonify({"message": "paid", "reward_id": reward.id})
    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()

@rewards_bp.route("/rewards", methods=["GET"])
def get_rewards():
    db = SessionLocal()
    try:
        rewards = db.query(Reward).all()
        return jsonify([{
            "id": r.id,
            "log_id": r.log_id,
            "status": r.status.value,
            "paid_at": r.paid_at.isoformat() if r.paid_at else None
        } for r in rewards])
    finally:
        db.close()

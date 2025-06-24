from models import Log, Reward, RewardStatus
from flask import Blueprint, request, jsonify
from database import SessionLocal
from models import Log
from datetime import datetime, timezone

tracking_bp = Blueprint("tracking", __name__)

@tracking_bp.route("/track", methods=["POST"])
def track():
    db = SessionLocal()
    try:
        data = request.get_json()
        user_id = data.get("user_id")
        campaign_id = data.get("campaign_id")
        result = data.get("event")

        ip = request.remote_addr
        device = request.user_agent.string

        # 1. 로그 저장
        log = Log(
            user_id=user_id,
            campaign_id=campaign_id,
            result=result,
            ip=ip,
            device=device,
            action_time=datetime.now(timezone.utc)
        )
        db.add(log)
        db.commit()
        db.refresh(log)

        # 2. 리워드 자동 지급 (status = "paid")
        reward = Reward(
            log_id=log.id,
            status=RewardStatus.paid,
            paid_at=datetime.now(timezone.utc)
        )
        db.add(reward)
        db.commit()

        return jsonify({
            "message": "tracked and rewarded",
            "log_id": log.id,
            "reward_id": reward.id
        })

    except Exception as e:
        db.rollback()
        return jsonify({"error": str(e)}), 400
    finally:
        db.close()
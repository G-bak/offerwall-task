from database import SessionLocal
from models import Campaign
from datetime import datetime, timezone

def auto_register_campaign():
    db = SessionLocal()
    try:
        existing = db.query(Campaign).filter_by(
            user_id="admin1",
            link="https://shopping.naver.com"
        ).first()

        if not existing:
            campaign = Campaign(
                user_id="admin1",
                type="쇼핑",
                subtype="네이버 플레이스",
                keywords="운동화, 키즈",
                rank_keyword="운동화 추천",
                link="https://shopping.naver.com",
                start_date=datetime(2025, 6, 24, tzinfo=timezone.utc),
                end_date=datetime(2025, 6, 30, tzinfo=timezone.utc),
                quantity=100,
                created_at=datetime.now(timezone.utc)
            )
            db.add(campaign)
            db.commit()
            print("✅ 기본 캠페인 자동 등록 완료.")
        else:
            print("ℹ️ 이미 존재하는 캠페인입니다. 자동 등록 생략됨.")
    except Exception as e:
        print(f"❌ 자동 캠페인 등록 실패: {e}")
    finally:
        db.close()

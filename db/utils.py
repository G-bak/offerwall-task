import json
from pathlib import Path
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from db.models import Campaign
from dateutil.parser import isoparse

# ✅ 실제 경로로 수정
CAMPAIGN_TEMPLATE_PATH = Path("data/init_campaign_data.json")

async def create_campaign_from_file(db: AsyncSession):
    if not CAMPAIGN_TEMPLATE_PATH.exists():
        raise FileNotFoundError("❌ 캠페인 템플릿 JSON 파일이 존재하지 않습니다.")

    with open(CAMPAIGN_TEMPLATE_PATH, encoding="utf-8") as f:
        payload = json.load(f)

    stmt = select(Campaign).where(
        Campaign.user_id == payload["user_id"],
        Campaign.type == payload["type"],
        Campaign.subtype == payload["subtype"]
    )
    result = await db.execute(stmt)
    existing = result.scalar_one_or_none()

    if existing:
        print(f"⚠️ 이미 존재하는 캠페인: ID = {existing.id}")
        return existing.id

    campaign = Campaign(
        user_id=payload["user_id"],
        type=payload["type"],
        subtype=payload["subtype"],
        keywords=payload.get("keywords"),
        rank_keyword=payload.get("rank_keyword"),
        link=payload["link"],
        start_date=isoparse(payload["start_date"]),
        end_date=isoparse(payload["end_date"]),
        quantity=payload["quantity"]
    )

    db.add(campaign)
    await db.commit()
    await db.refresh(campaign)

    print(f"✅ 캠페인 생성 완료: ID = {campaign.id}")
    return campaign.id

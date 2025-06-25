from fastapi import APIRouter, Depends, Request
from fastapi.responses import JSONResponse, HTMLResponse
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import datetime, timezone
from db.models import Log, Reward, RewardStatus
from db.mysql import get_db

router = APIRouter()
templates = Jinja2Templates(directory="templates")

@router.get("/tracking-test", response_class=HTMLResponse)
async def track_test_page(request: Request):
    return templates.TemplateResponse("tracking-demo.html", {"request": request})

@router.post("/track")
async def track(request: Request, db: AsyncSession = Depends(get_db)):
    data = await request.json()

    user_id = data.get("user_id")
    campaign_id = data.get("campaign_id")

    log = Log(
        user_id=user_id,
        campaign_id=campaign_id,
        result="valid",
        ip=request.client.host,
        device=data.get("device"),
        event=data.get("event"),
        referrer=data.get("referrer"),
        user_agent=data.get("user_agent"),
        language=data.get("language"),
        screen=data.get("screen"),
        keyword=data.get("keyword")
    )

    reward = Reward(
        log_id=None,  # 이후에 log.id로 채움
        status=RewardStatus.paid,
        description=data.get("keyword")  # 🆕 키워드를 보상 내용으로 저장
    )

    async with db.begin():
        db.add(log)
        await db.flush()
        reward.log_id = log.id
        db.add(reward)

    # 👉 이 부분 추가
    await db.refresh(reward)

    return JSONResponse(status_code=200, content={
        "message": "트래킹 완료",
        "reward": {
            "status": reward.status.value,
            "paid_at": reward.paid_at.isoformat(),
            "description": reward.description
        }
    })

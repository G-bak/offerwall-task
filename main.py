import db.models  # 👈 이 줄 없으면 테이블이 등록되지 않음
from db.mysql import get_db, Base, engine, AsyncSessionLocal
from db.utils import create_campaign_from_file  # ✅ 유틸 함수 import
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, Depends, status, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio import AsyncSession
from services.exception_handlers import register_exception_handlers
from services.log_config import _log_traceback, setup_logging
import sys
from fastapi.middleware.cors import CORSMiddleware

from routers.sql_workbench.router import router as sql_workbench_router
from routers.tracking.router import router as tracking_router

@asynccontextmanager
async def app_lifespan(app: FastAPI):
    async with engine.begin() as conn:
        # print("💥 Dropping all tables...")
        # await conn.run_sync(Base.metadata.drop_all)

        print("🚀 Creating all tables...")
        await conn.run_sync(Base.metadata.create_all)
        print(Base.metadata.tables.keys())

    # ✅ 캠페인 자동 생성
    async with AsyncSessionLocal() as session:
        try:
            await create_campaign_from_file(session)
        except Exception as e:
            print(f"⚠️ 캠페인 생성 실패: {e}")

    yield
    await engine.dispose()

app = FastAPI(lifespan=app_lifespan)
# CORS 설정 (모든 도메인 허용)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 origin 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 헤더 허용
)
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")
logger = setup_logging()

# 예외 핸들러 등록
register_exception_handlers(app)

# 라우터 등록
app.include_router(sql_workbench_router)
app.include_router(tracking_router)

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc: HTTPException):
    tb_info = sys.exc_info()[2]
    traceback_details = _log_traceback(tb_info, str(exc))

    logger.error(f"404 Error: Path={request.url.path}, Method={request.method}, Client={request.client.host}")

    return templates.TemplateResponse("error.html", {
        "request": request,
        "error_code": 404,
        "error_message": str(exc.detail) if hasattr(exc, "detail") else str(exc),
        "traceback_info": traceback_details
    }, status_code=404)

# .well-known/* 경로 대응
@app.get("/.well-known/{subpath:path}")
async def handle_well_known(subpath: str):
    return Response(content=f"Not Found: /.well-known/{subpath}", status_code=status.HTTP_404_NOT_FOUND)

@app.get("/")
async def read_root():
    try:
        return RedirectResponse(url="/sql-workbench", status_code=303)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
    
@app.get("/divide-by-zero")
async def divide_by_zero():
    try:
        return 1 / 0
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))
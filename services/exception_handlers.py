import sys
from fastapi import Request, FastAPI
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.exceptions import RequestValidationError
from fastapi.templating import Jinja2Templates
from fastapi.exceptions import HTTPException as FastAPIHTTPException
from starlette.status import HTTP_422_UNPROCESSABLE_ENTITY
from services.log_config import setup_logging, _log_traceback

templates = Jinja2Templates(directory="templates")
logger = setup_logging()

# ✅ 커스텀 예외 클래스
class AppException(Exception):
    def __init__(self, status_code: int, message: str, location: str = None):
        self.status_code = status_code
        self.message = message
        self.location = location
        super().__init__(message)


# ✅ AppException 핸들러
async def custom_app_exception_handler(request: Request, exc: AppException):
    tb_info = exc.__traceback__ or sys.exc_info()[2]
    traceback_details = _log_traceback(tb_info, str(exc))

    # 303 리디렉션 처리
    if exc.status_code == 303 and exc.location:
        return RedirectResponse(url=exc.location, status_code=exc.status_code)

    return templates.TemplateResponse("error.html", {
        "request": request,
        "error_code": exc.status_code,
        "error_message": exc.message,
        "traceback_info": traceback_details
    }, status_code=exc.status_code)


# ✅ HTTPException 핸들러 (404 포함)
async def custom_http_exception_handler(request: Request, exc: FastAPIHTTPException):
    tb_info = exc.__traceback__ or sys.exc_info()[2]
    traceback_details = _log_traceback(tb_info, str(exc))

    logger.error(f"{exc.status_code} Error: Path={request.url.path}, Detail={exc.detail}")

    return templates.TemplateResponse("error.html", {
        "request": request,
        "error_code": exc.status_code,
        "error_message": str(exc.detail),
        "traceback_info": traceback_details
    }, status_code=exc.status_code)


# ✅ RequestValidationError 핸들러 (폼/쿼리 검증 실패 시)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    tb_info = sys.exc_info()[2]
    traceback_details = _log_traceback(tb_info, str(exc))

    errors = [{"field": e["loc"][-1], "message": e["msg"]} for e in exc.errors()]
    summarized = ", ".join(f"{e['field']}: {e['message']}" for e in errors)

    return templates.TemplateResponse("error.html", {
        "request": request,
        "error_code": HTTP_422_UNPROCESSABLE_ENTITY,
        "error_message": "The input value is invalid.",
        "traceback_info": summarized or traceback_details
    }, status_code=HTTP_422_UNPROCESSABLE_ENTITY)


# ✅ 일반적인 Exception 핸들러
async def custom_unexpected_exception_handler(request: Request, exc: Exception):
    tb_info = sys.exc_info()[2]
    traceback_details = _log_traceback(tb_info, str(exc))

    return templates.TemplateResponse("error.html", {
        "request": request,
        "error_code": 500,
        "error_message": "An unexpected error occurred",
        "traceback_info": traceback_details
    }, status_code=500)


# ✅ 모든 핸들러 등록 함수 (main.py에서 호출)
def register_exception_handlers(app: FastAPI):
    app.add_exception_handler(AppException, custom_app_exception_handler)
    app.add_exception_handler(FastAPIHTTPException, custom_http_exception_handler)
    app.add_exception_handler(RequestValidationError, validation_exception_handler)
    app.add_exception_handler(Exception, custom_unexpected_exception_handler)
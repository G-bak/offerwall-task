import logging, traceback, os
from logging.handlers import RotatingFileHandler
from pathlib import Path

# 상대 경로로 로그 디렉터리 설정
BASE_LOG_DIR = Path("logs")  # 현재 작업 디렉터리 기준 logs/

def setup_logging():
    try:
        # 로그 디렉터리 생성
        BASE_LOG_DIR.mkdir(parents=True, exist_ok=True)

        # 로그 파일 경로
        log_file = BASE_LOG_DIR / "app.log"

        # 로그 포매터 설정
        log_formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(filename)s:%(lineno)d - %(message)s"
        )

        # 로거 생성
        logger = logging.getLogger("app_logger")
        if logger.hasHandlers():
            return logger  # 기존 핸들러가 있으면 그대로 반환

        # 파일 핸들러 설정
        file_handler = RotatingFileHandler(str(log_file), maxBytes=10_000_000, backupCount=5)
        file_handler.setLevel(logging.INFO)
        file_handler.setFormatter(log_formatter)

        # 콘솔 핸들러 설정
        console_handler = logging.StreamHandler()
        console_handler.setLevel(logging.ERROR)
        console_handler.setFormatter(log_formatter)

        # 로거에 핸들러 추가
        logger.setLevel(logging.DEBUG)
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

        logger.info("Logging setup complete")
        return logger
    except Exception as e:
        print(f"Error setting up logging: {e}")
        raise

def _log_traceback(traceback_info, exception_message=None):
    logger = setup_logging()
    log_lines = []

    if exception_message:
        msg = f"Exception message: {exception_message}"
        logger.error(msg)
        log_lines.append(msg)

    tb = traceback.extract_tb(traceback_info)
    if tb:
        for frame in tb:
            relative_path = os.path.relpath(frame.filename, start=os.getcwd())
            line = f"File: {relative_path}, Line: {frame.lineno}, Function: {frame.name}, Code: {frame.line}"
            logger.error(line)
            log_lines.append(line)

    return "\n".join(log_lines)
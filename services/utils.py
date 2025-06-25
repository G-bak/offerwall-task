import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent  # 루트 디렉터리
GUIDE_DIR = BASE_DIR / "data" / "guide"

def load_json(path: Path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except FileNotFoundError:
        raise RuntimeError(f"파일을 찾을 수 없습니다: {path}")
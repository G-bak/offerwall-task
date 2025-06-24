from flask import Flask
from flask_cors import CORS
from seed_data import auto_register_campaign
from routers.tracking import tracking_bp
from routers.campaigns import campaigns_bp
from routers.rewards import rewards_bp
from routers.logs import logs_bp
from routers.reports import reports_bp
from database import Base, engine
import models

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": ["http://localhost:5500"]}})

# 루트 페이지 응답
@app.route("/")
def home():
    return {"message": "Offerwall Tracking API Server is running."}

# 테이블 생성
Base.metadata.drop_all(bind=engine)
Base.metadata.create_all(bind=engine)

# 자동 캠페인 등록
auto_register_campaign()

# API 라우터 등록
app.register_blueprint(tracking_bp)
app.register_blueprint(campaigns_bp)
app.register_blueprint(rewards_bp)
app.register_blueprint(logs_bp)
app.register_blueprint(reports_bp)

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=5000)

오퍼월 트래픽 캠페인 플랫폼 과제 - README
=======================================

📌 프로젝트 설명
------------------
이 프로젝트는 오퍼월 기반으로 광고주가 네이버 쇼핑/플레이스에 유입을 발생시키고,  
그에 따라 리워드를 자동으로 지급하는 트래킹/보상 시스템을 구현한 실무 과제입니다.

사용자가 광고 링크에 접속하면 자동으로 유입 로그가 저장되고,  
즉시 리워드도 자동 지급되며, 관리자 페이지에서 전체 캠페인과 통계, 유입 순위 등을 확인할 수 있습니다.

---

📁 폴더 구조
------------------
project-answer/
├── backend/                # Flask 기반 백엔드 API 서버
│   ├── app.py              # 서버 실행 진입점
│   ├── database.py         # MySQL 연결 및 SQLAlchemy 설정
│   ├── models.py           # DB 테이블 정의 (Campaign, Log, Reward)
│   ├── seed_data.py        # 서버 시작 시 초기 캠페인 자동 등록
│   ├── routers/
│   │   ├── campaigns.py    # 캠페인 등록/조회 API
│   │   ├── tracking.py     # 유입 트래킹 및 자동 보상 API
│   │   ├── rewards.py      # 리워드 지급 상태 API
│   │   ├── logs.py         # 전체 유입 로그 API
│   │   └── reports.py      # 관리자 리포트 API (유입 순위 등)
│   └── requirements.txt    # pip 설치용 패키지 목록
│
├── frontend/               # 프론트엔드 HTML + JS
│   ├── index.html              # 수동 유입 트래킹 테스트
│   ├── form.js                 # index.html 연동 JS
│   ├── track.js                # 광고 삽입용 트래킹 스크립트
│   ├── test_auto.html          # 자동 트래킹 테스트 페이지
│   ├── register_campaign.html  # 광고주용 캠페인 등록 폼
│   ├── manage_campaigns.html   # 캠페인 목록 및 유입 수 확인
│   ├── reports.html            # 사용자 유입 순위 리포트
│   └── dashboard.html          # 관리자 통합 대시보드
│
└── README.txt              # 이 문서

---

⚙ 기술 스택
------------------
- 백엔드: Python 3 + Flask + SQLAlchemy + MySQL
- 프론트엔드: HTML + JavaScript (Vanilla)
- API 통신: RESTful JSON
- 유입 트래킹: 수동 호출 + 광고 삽입 JS 방식
- 실행 환경: 로컬 테스트 (AWS EC2 + RDS로 확장 가능)

---

🧪 실행 및 테스트 절차
------------------

1. ✅ MySQL 데이터베이스 생성
CREATE DATABASE offerwall CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

2. ✅ 백엔드 서버 실행
cd backend  
pip install -r requirements.txt  
python app.py

※ `seed_data.py`를 통해 캠페인 1건이 자동 등록됩니다.

3. ✅ 캠페인 등록 방법
- 브라우저 접속: http://localhost:5500/frontend/register_campaign.html  
- 입력 후 "등록하기" 클릭 → 등록 완료 메시지 출력

(또는 Postman 사용)
POST http://localhost:5000/campaigns  
{
  "user_id": "admin1",
  "type": "쇼핑",
  "subtype": "네이버 플레이스",
  "keywords": "운동화, 키즈",
  "rank_keyword": "운동화 추천",
  "link": "https://shopping.naver.com",
  "start_date": "2025-06-24T00:00:00",
  "end_date": "2025-06-30T00:00:00",
  "quantity": 100
}

4. ✅ 프론트엔드 실행
cd frontend  
python -m http.server 5500

5. ✅ 유입 테스트 방법
- 수동 트래킹: http://localhost:5500/frontend/index.html  
  → 사용자 ID / 캠페인 ID 입력 후 `[수동 전송]` 버튼 클릭
- 자동 트래킹: http://localhost:5500/frontend/test_auto.html  
  → 페이지 접속 시 자동 전송됨

6. ✅ 관리자 기능 확인
- 캠페인 현황: http://localhost:5500/frontend/manage_campaigns.html  
- 유입 랭킹: http://localhost:5500/frontend/reports.html  
- 대시보드 전체 보기: http://localhost:5500/frontend/dashboard.html

7. ✅ 리워드 자동 지급 확인
- `/track` 호출 시 로그 저장과 동시에 리워드가 자동 생성됨 (`status = paid`)  
- 수동 지급 API 호출 없이 자동 처리됨

---

📌 주요 API 요약
------------------
- POST /campaigns : 캠페인 등록
- GET /campaigns : 캠페인 목록 조회
- POST /track : 유입 로그 기록 및 자동 보상
- GET /logs : 전체 유입 로그 확인
- GET /rewards : 리워드 상태 확인
- GET /reports/top-users : 사용자 유입 순위 (TOP 10)

---

🔒 참고 사항
------------------
- 모든 API는 CORS 허용되어 JS에서 직접 호출 가능
- 유입 로그는 IP, User-Agent, 시간 기록 포함
- `track.js`는 광고주 웹사이트에 삽입해 자동 트래킹 처리 가능
- 캠페인 목표 수량 달성 시 상태가 "완료"로 표시됨

---

📦 GitHub 저장소
------------------
🔗 https://github.com/G-bak/offerwall-task.git  
→ 전체 코드, 폴더 구조, 실행 예시 포함

---

🙌 감사합니다!

📁 프로젝트명: 오퍼월 트래픽 캠페인 플랫폼

📝 설명:
이 프로젝트는 유저가 광고를 클릭하거나 앱을 설치할 때 발생하는 트래킹 이벤트를 기록하고, 그에 따라 리워드를 지급하는 오퍼월(Offerwall) 트래픽 기반 캠페인 플랫폼입니다. 광고주는 캠페인을 등록하고, 사용자는 유입을 발생시키며, 서버는 이를 추적하여 리워드 처리까지 자동으로 수행합니다.


📦 주요 기능:

1. ✅ 캠페인 등록 및 관리
   - 광고주가 캠페인을 등록 (앱 설치, 웹 방문 등)
   - URL 파라미터 기반 유저 추적 ID 포함

2. 📡 유입 트래킹
   - 사용자 클릭/설치 등 이벤트를 서버에서 수신
   - user_id, campaign_id, device 정보 기록

3. 📊 유입 로그 관리
   - 관리자가 유입 로그 확인 가능
   - 필터링: 캠페인별, 유저별, 상태별

4. 💰 리워드 자동 지급
   - 유효한 유입 발생 시 자동으로 '지급 완료' 처리
   - 중복 유입 차단 로직 포함

5. 🔒 보안 및 필터링
   - 동일 user_id + campaign_id 조합 중복 차단
   - reward 상태: unpaid → paid 자동 전환


🧪 실행 및 테스트 절차

1. ✅ 브라우저 접속: http://acelifetest.com
- 관리자 페이지 접속

2. ✅ 캠페인 등록
- 캠페인 1건 자동 등록 되어있음.
- 좌측 사이드바 '캠페인 관리 조회' 클릭 > 전체 캠페인 통계 확인 가능
- 우측 상단 '리포트 다운로드' 버튼 클릭
- 모달창 표시 > CSV or Excel 선택

3. ✅ 유입 트래킹 테스트
- 우측 상단 '유입 트래킹 테스트' 버튼 클릭
- 모달창 표시 > 키워드 입력 > 현재 페이지 url 파라미터 생성 > 유입 트래킹 JS 스크립트 포함된 페이지로 이동
- 우측 상단 '리포트 다운로드' 버튼 클릭
- 모달창 표시 > CSV or Excel 선택

4. ✅ 유입 상세 로그 조회
- 좌측 사이드바 '유입 상세 로그 조회' 버튼 클릭
- 전체 캠페인의 유입 로그를 조회
- 우측 상단 '리포트 다운로드' 버튼 클릭
- 모달창 표시 > CSV or Excel 선택

5. ✅ 실시간 유입 보상 통계
- 좌측 사이드바 '실시간 유입 보상 통계' 버튼 클릭
- 최근 1시간 동안 5분 간격으로 유입 수와 보상 수를 집계
- 우측 상단 '차트 보기' 버튼 클릭
- 모달창 표시 > 원하는 차트 및 그래프 선택

6. ✅ 키워드별 유입 성과 분석
- 좌측 사이드바 '키워드별 유입 성과 분석' 버튼 클릭
- 각 검색 키워드를 기준으로 총 유입 수와 그에 따른 보상 지급 수를 집계
- 우측 상단 '차트 보기' 버튼 클릭
- 모달창 표시 > 원하는 차트 및 그래프 선택

7. ✅ 운영체제별 디바이스 통계
- 좌측 사이드바 '운영체제별 디바이스 통계' 버튼 클릭
- 어떤 디바이스(예: iPhone, Galaxy, PC 등)에서 유입이 많았는지 파악
- 우측 상단 '차트 보기' 버튼 클릭
- 모달창 표시 > 원하는 차트 및 그래프 선택

8. ✅ 원하는 데이터 분석 통계 및 분석 기능 추가
- SQL 쿼리 입력 후 'SQL 파일 저장' 버튼 클릭
- 좌측 사이드바 Guide / .sql 파일 저장 > 클릭 시 쿼리 자동 입력


📁 디렉토리 구조:
.
├── data/
│   └── guide/
│       ├── 1_캠페인 등록.json
│       ├── 2_유입 트래킹 JS 스크립트.js
│       ├── 3_캠페인 관리 조회.sql
│       ├── 4_유입 상세 로그 조회.sql
│       ├── 5_실시간 유입 보상 통계.sql
│       ├── 6_키워드별 유입 성과 분석.sql
│       ├── 7_운영체계별 디바이스 통계.sql
│   └── init_campaign_data.json
├── db/
│   ├── models.py
│   ├── mysql.py
│   └── utils.py
├── logs/
│   └── app.log
├── routers/
│   ├── sql_workbench/
│   │   └── router.py
│   └── tracking/
│       └── router.py
├── services/
│   ├── exception_handlers.py
│   ├── log_config.py
│   └── utils.py
├── static/
│   ├── css/
│   ├── img/
│   └── js/
├── templates/
│   ├── error.html
│   ├── index.html
│   ├── sql-workbench.html
│   └── tracking-demo.html
├── posh/
├── main.py
├── README.txt
└── requirements.txt


⚙️ 기술 스택:
- 백엔드: Python 3 + FastAPI + SQLAlchemy + MySQL + openpyxl (엑셀 내보내기용)
- 프론트엔드: HTML + CSS + Bootstrap 5 + JavaScript (Vanilla)
- API 통신: RESTful JSON
- 유입 트래킹: 수동 호출 + 광고 삽입 JS 방식
- 실행 환경: 로컬 테스트 (AWS EC2 + RDS로 확장 가능)


📌 개발/테스트 환경:
- OS: Windows 11 / macOS
- DB: MySQL 8.x
- Python venv 또는 Conda 환경 권장


📎 GitHub:
- https://github.com/G-bak/offerwall-task.git


🔒 참고 사항
- 모든 API는 CORS 허용되어 JS에서 직접 호출 가능
- 유입 로그는 IP, User-Agent, 시간 기록 포함
- `track.js`는 광고주 웹사이트에 삽입해 자동 트래킹 처리 가능


✍ 작성자:
- 최재빈 (재빈 최)


🙌 감사합니다!
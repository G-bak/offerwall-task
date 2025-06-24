오퍼월 실무 과제 실행 방법 안내
==============================

[✔️ 프로젝트 개요]
사용자가 이름을 입력하면, 백엔드가 인사 메시지를 반환하는 간단한 웹 애플리케이션입니다.
- 프론트엔드: HTML + JS
- 백엔드: Python Flask API


[📦 GitHub 저장소]
https://github.com/G-bak/offerwall-task.git

GitHub에서 다운로드하려면:

1. Git 설치:
   https://git-scm.com/downloads

2. 터미널 또는 명령 프롬프트 열기
3. 아래 명령어로 저장소 복제:
   git clone https://github.com/G-bak/offerwall-task.git
4. 디렉토리로 이동:
   cd offerwall-task


[▶️ 백엔드 실행 방법]
1. Python 3 설치 필요
2. 의존 패키지 설치:
   pip install flask flask-cors

3. 서버 실행:
   python backend/api.py

4. 실행 확인:
   http://localhost:5000 (API만 존재, 웹 페이지 없음)


[🌐 프론트엔드 실행 방법]
1. frontend/index.html 파일을 브라우저에서 직접 열기 (더블클릭)
   또는 터미널에서 로컬 서버 실행:
   cd frontend
   python -m http.server 5500

2. 브라우저 접속: http://localhost:5500

3. 이름 입력 후 "보내기" 버튼 클릭 → 결과 메시지 표시


[📌 주의사항]
- 백엔드 서버가 먼저 실행되어 있어야 합니다.
- 프론트엔드는 백엔드의 http://localhost:5000/api/greet 로 POST 요청을 보냅니다.
- 브라우저 CORS 오류가 발생하지 않도록 Flask 서버는 CORS 허용이 적용돼 있습니다.


[🗂 폴더 구조]
project-answer/
├── frontend/
│   ├── index.html
│   └── form.js
├── backend/
│   └── api.py
└── README.txt

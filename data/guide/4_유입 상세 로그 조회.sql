-- 전체 캠페인의 유입 로그를 조회합니다.
-- 유입 시간, 기기/브라우저 정보, 유입 키워드, 경로, 이벤트, 보상 상태 등 확인 가능
-- 가장 최근 유입 순으로 정렬됩니다.

SELECT
    l.id AS 로그ID,
    l.campaign_id AS 캠페인ID,
    l.action_time AS 유입시간,
    l.device AS 디바이스,
    l.user_agent AS 브라우저정보,
    l.keyword AS 유입키워드,
    l.referrer AS 유입경로,
    l.language AS 언어,
    l.screen AS 화면해상도,
    l.ip AS IP주소,
    l.event AS 이벤트,
    r.status AS 보상상태,
    r.paid_at AS 보상지급일시,
    r.description AS 보상내용
FROM logs l
LEFT JOIN rewards r ON r.log_id = l.id
ORDER BY l.action_time DESC;
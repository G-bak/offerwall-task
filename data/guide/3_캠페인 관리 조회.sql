-- 등록된 캠페인들의 상태와 유입 및 보상 통계를 확인하기 위한 용도로 사용됩니다.
-- 각 캠페인에 대해 캠페인 ID, 이름(랭킹 키워드), 링크, 현재 상태(종료일을 기준으로 판단),
-- 유입된 방문자 수(로그 기준), 실제 보상이 지급된 건수, 그리고 등록일을 함께 조회합니다.
-- 가장 최근에 등록된 캠페인이 위에 오도록 정렬됩니다.

SELECT
    c.id AS 캠페인ID,
    c.rank_keyword AS 캠페인명,
    c.link AS 캠페인링크,
    CASE
        WHEN c.end_date < NOW() THEN '종료'
        ELSE '진행중'
    END AS 캠페인상태,
    COUNT(DISTINCT l.id) AS 총유입수,
    COUNT(DISTINCT IF(r.status = 'paid', r.id, NULL)) AS 보상지급수,
    c.created_at AS 생성일시
FROM campaigns c
LEFT JOIN logs l ON l.campaign_id = c.id
LEFT JOIN rewards r ON r.log_id = l.id
GROUP BY 
    c.id, c.rank_keyword, c.link, c.end_date, c.created_at
ORDER BY 
    c.created_at DESC;
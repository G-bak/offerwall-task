-- 키워드별 유입 성과 분석 쿼리
-- 각 검색 키워드를 기준으로 총 유입 수와 그에 따른 보상 지급 수를 집계합니다.
-- 유입은 logs 테이블의 keyword 기준이며,
-- 보상은 rewards 테이블의 상태가 'paid'인 경우만 포함됩니다.

SELECT
    l.keyword AS 키워드,                          -- 유입 시 사용된 검색 키워드
    COUNT(DISTINCT l.id) AS 유입수,               -- 해당 키워드로 발생한 총 유입 수
    COUNT(DISTINCT r.id) AS 보상수                -- 유입 중 실제 보상 지급된 수
FROM logs l
LEFT JOIN rewards r ON r.log_id = l.id AND r.status = 'paid'
WHERE l.keyword IS NOT NULL AND l.keyword != ''   -- 키워드가 존재하는 경우만 집계
GROUP BY l.keyword
ORDER BY 유입수 DESC;

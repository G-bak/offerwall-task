-- 최근 1시간 동안 5분 간격으로 유입 수와 보상 수를 집계하는 SQL
-- 시간 단위는 현재 시각 기준으로 직전 1시간을 5분 단위로 나눈다

WITH time_slots AS (
  SELECT
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (n * 5) MINUTE), '%Y-%m-%d %H:%i:00') AS slot_start,
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (n * 5 - 5) MINUTE), '%Y-%m-%d %H:%i:00') AS slot_end,
    DATE_FORMAT(DATE_SUB(NOW(), INTERVAL (n * 5) MINUTE), '%H:%i') AS 시간
  FROM (
    SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL
    SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL
    SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11
  ) AS minutes
)

SELECT
  ts.시간,
  COUNT(DISTINCT l.id) AS 유입수,
  COUNT(DISTINCT r.id) AS 보상수
FROM time_slots ts
LEFT JOIN logs l
  ON l.action_time BETWEEN ts.slot_start AND ts.slot_end
LEFT JOIN rewards r
  ON r.log_id = l.id AND r.status = 'paid'
GROUP BY ts.시간
ORDER BY ts.시간;
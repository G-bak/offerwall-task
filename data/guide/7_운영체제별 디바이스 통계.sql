-- 로그 기준으로 디바이스별 유입 통계를 분석하는 쿼리입니다.
--   목적:
--   - 어떤 디바이스(예: iPhone, Galaxy, PC 등)에서 유입이 많았는지 파악
--   - 전체 유입 대비 각 디바이스가 차지하는 비율(%) 계산
--   - 디바이스별 마지막 유입 시간 확인

SELECT
  운영체제,
  COUNT(*) AS 유입수
FROM (
  SELECT
    CASE
        WHEN LOWER(user_agent) LIKE '%iphone%' THEN 'IPhone'
        WHEN LOWER(user_agent) LIKE '%ipad%' THEN 'IPad'
        WHEN LOWER(user_agent) LIKE '%android%' THEN 'Android'
        WHEN LOWER(user_agent) LIKE '%windows%' THEN 'Windows'
        WHEN LOWER(user_agent) LIKE '%macintosh%' OR LOWER(user_agent) LIKE '%mac os%' THEN 'Mac OS'
        WHEN LOWER(user_agent) LIKE '%cros%' THEN 'Chrome OS'
      ELSE '기타'
    END AS 운영체제
  FROM logs
) AS 정규화
GROUP BY 운영체제
ORDER BY 유입수 DESC;
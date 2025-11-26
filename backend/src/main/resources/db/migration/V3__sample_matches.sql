-- V3__sample_matches.sql
-- 12개 팀 기준: 2025-08 ~ 2026-05 사이 주말 슬롯에 샘플 경기 자동 생성
-- 홈팀은 해당 팀 이름이 포함된 경기장으로 매핑하여 등록
-- 재실행 시 동일 (홈,원정,일시) 조합은 중복 삽입하지 않음

SET client_min_messages = WARNING;
-- 킥오프 시간을 서울 기준으로 넣고 싶으면 +09:00을 명시
-- (DB는 timestamptz이므로 타임존 정보를 함께 저장)
-- SET TIME ZONE 'Asia/Seoul';

-- 시즌 범위 설정 (필요 시 변경)
WITH
params AS (
  SELECT
    DATE '2025-08-01' AS season_start,
    DATE '2026-05-31' AS season_end
),

-- 팀별 홈 경기장 매핑: 경기장 이름에 팀명이 포함된 것 우선 매칭
home_map AS (
  SELECT DISTINCT ON (t.team_id)
         t.team_id,
         s.stadium_id
  FROM teams t
  JOIN stadiums s
    ON s.name ILIKE '%' || t.name || '%'
  ORDER BY t.team_id, s.stadium_id
),

-- 주말(토/일) 슬롯 생성: 토요일 15:00+09, 일요일 17:30+09
sat_slots AS (
  SELECT (gs)::date AS d
  FROM params p
  CROSS JOIN generate_series(p.season_start, p.season_end, interval '7 days') AS gs
  WHERE EXTRACT(DOW FROM gs) IN (6, 0)  -- 안전하게 토/일만 추리기 위한 필터는 아래에서 합칠 때 적용
),
sun_slots AS (
  SELECT (gs + interval '1 day')::date AS d
  FROM params p
  CROSS JOIN generate_series(p.season_start, p.season_end, interval '7 days') AS gs
),
date_slots AS (
  SELECT d::timestamptz AT TIME ZONE 'UTC' AS start_at_utc
  FROM (
    -- 토요일 15:00 +09
    SELECT (d::text || ' 15:00+09')::timestamptz AS d FROM sat_slots
    UNION ALL
    -- 일요일 17:30 +09
    SELECT (d::text || ' 17:30+09')::timestamptz AS d FROM sun_slots
  ) x
  WHERE d::date BETWEEN (SELECT season_start FROM params) AND (SELECT season_end FROM params)
),
date_slots_numbered AS (
  SELECT start_at_utc, ROW_NUMBER() OVER (ORDER BY start_at_utc) AS rn
  FROM date_slots
),

-- 팀 페어(중복 없는 조합) 생성
pairs AS (
  SELECT t1.team_id AS t1, t2.team_id AS t2
  FROM teams t1
  JOIN teams t2 ON t2.team_id > t1.team_id
),
pairs_numbered AS (
  SELECT t1, t2, ROW_NUMBER() OVER (ORDER BY t1, t2) AS rn
  FROM pairs
),

-- 사용할 개수: 슬롯 수와 페어 수 중 최소치만 사용
counts AS (
  SELECT
    (SELECT COUNT(*) FROM date_slots_numbered) AS slot_cnt,
    (SELECT COUNT(*) FROM pairs_numbered)      AS pair_cnt
),
limit_n AS (
  SELECT LEAST(slot_cnt, pair_cnt) AS n FROM counts
),

-- 페어와 날짜 매칭 + 홈/원정 번갈아 배정(결정적: rn 홀/짝)
scheduled AS (
  SELECT
    CASE WHEN (p.rn % 2) = 1 THEN p.t1 ELSE p.t2 END AS home_team_id,
    CASE WHEN (p.rn % 2) = 1 THEN p.t2 ELSE p.t1 END AS away_team_id,
    d.start_at_utc AS start_at
  FROM pairs_numbered p
  JOIN date_slots_numbered d ON d.rn = p.rn
  WHERE p.rn <= (SELECT n FROM limit_n)
),

-- 홈팀 → 홈 경기장 매핑 조인
ready AS (
  SELECT
    hm.stadium_id,
    s.home_team_id,
    s.away_team_id,
    s.start_at
  FROM scheduled s
  JOIN home_map hm ON hm.team_id = s.home_team_id
)

-- 최종 삽입 (동일 경기 중복 방지)
INSERT INTO matches (stadium_id, home_team_id, away_team_id, start_at, status, home_score, away_score)
SELECT
  r.stadium_id,
  r.home_team_id,
  r.away_team_id,
  r.start_at,
  'SCHEDULED'::match_status,
  0, 0
FROM ready r
LEFT JOIN matches m
  ON m.home_team_id = r.home_team_id
 AND m.away_team_id = r.away_team_id
 AND m.start_at    = r.start_at
WHERE m.match_id IS NULL;

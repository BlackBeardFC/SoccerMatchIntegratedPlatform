-- V2__seed_12_teams_stadiums_sections_and_seats.sql
-- 구단 12개 + 구단별 전용 경기장 + A/B/C 구역 좌석 (행×열) 시드
-- 팀 티어: PREMIUM / STANDARD / COMPACT (구단별 기준)

SET client_min_messages = WARNING;
SET TIME ZONE 'UTC';

-- 0) 티어 enum이 없다면 생성
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'seat_tier') THEN
        CREATE TYPE seat_tier AS ENUM ('PREMIUM', 'STANDARD', 'COMPACT');
    END IF;
END$$;

-- 1) teams 테이블에 티어 컬럼 추가 (없을 때만)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'teams' AND column_name = 'tier'
    ) THEN
        ALTER TABLE teams ADD COLUMN tier seat_tier;
    END IF;
END$$;

-- 2) 입력 원본(구단/연고지/경기장/티어/좌석스펙) 테이블 변수 준비
WITH src(name, city, stadium, tier_txt, a_rows, a_cols, b_rows, b_cols, c_rows, c_cols) AS (
    VALUES
    ('검은수염','부천','검은수염 스타디움','STANDARD', 20,50, 18,45, 16,40),
    ('라쿤','김천','라쿤 아레나','COMPACT', 15,40, 14,35, 12,30),
    ('스네이크','대전','스네이크 파크','STANDARD', 20,50, 18,45, 16,40),
    ('엘리펀트','포항','엘리펀트 스타디움','STANDARD', 20,50, 18,45, 16,40),
    ('부엉이','서울','부엉이 필드','PREMIUM', 30,60, 28,56, 26,52),
    ('흰수염','인천','흰수염 돔','PREMIUM', 30,60, 28,56, 26,52),
    ('개미','광주','개미 스타디움','STANDARD', 20,50, 18,45, 16,40),
    ('까마귀','안양','까마귀 파크','COMPACT', 15,40, 14,35, 12,30),
    ('현무','울산','현무 아레나','PREMIUM', 30,60, 28,56, 26,52),
    ('참새','수원','참새 스타디움','PREMIUM', 30,60, 28,56, 26,52),
    ('문어','제주','문어돔','STANDARD', 20,50, 18,45, 16,40),
    ('두꺼비','대구','두꺼비 스타디움','PREMIUM', 30,60, 28,56, 26,52)
),

-- 3) 구단 등록(이름 고유)
ins_teams AS (
    INSERT INTO teams (name, city, logo_url, tier)
    SELECT s.name, s.city, NULL,
           CASE UPPER(s.tier_txt)
             WHEN 'PREMIUM'  THEN 'PREMIUM'::seat_tier
             WHEN 'STANDARD' THEN 'STANDARD'::seat_tier
             WHEN 'COMPACT'  THEN 'COMPACT'::seat_tier
           END
    FROM src s
    ON CONFLICT (name) DO UPDATE
      SET city = EXCLUDED.city,
          tier = EXCLUDED.tier
    RETURNING team_id, name
),

-- 4) 경기장 등록(이름 고유)
ins_stadiums AS (
    INSERT INTO stadiums (name, address)
    SELECT s.stadium, s.city || ' ' || COALESCE('시', '')
    FROM src s
    ON CONFLICT (name) DO NOTHING
    RETURNING stadium_id, name
),

-- 4-1) 모든 경기장 id 확보
stadium_ids AS (
    SELECT st.stadium_id, st.name
    FROM stadiums st
    JOIN src s ON s.stadium = st.name
),

-- 5) 섹션(A/B/C) 등록 + 기본가(티어별 대략값, 필요시 조정가능)
-- PREMIUM: A 70,000 / B 50,000 / C 30,000
-- STANDARD: A 55,000 / B 38,000 / C 22,000
-- COMPACT: A 40,000 / B 28,000 / C 18,000
ins_sections AS (
    INSERT INTO sections (stadium_id, name, base_price)
    SELECT
      si.stadium_id,
      sec.sec_name,
      CASE UPPER(s.tier_txt)
        WHEN 'PREMIUM'  THEN CASE sec.sec_name WHEN 'A' THEN 70000 WHEN 'B' THEN 50000 ELSE 30000 END
        WHEN 'STANDARD' THEN CASE sec.sec_name WHEN 'A' THEN 55000 WHEN 'B' THEN 38000 ELSE 22000 END
        WHEN 'COMPACT'  THEN CASE sec.sec_name WHEN 'A' THEN 40000 WHEN 'B' THEN 28000 ELSE 18000 END
      END AS base_price
    FROM src s
    JOIN stadium_ids si ON si.name = s.stadium
    CROSS JOIN (VALUES ('A'),('B'),('C')) AS sec(sec_name)
    ON CONFLICT (stadium_id, name) DO NOTHING
    RETURNING section_id, stadium_id, name
),

-- 5-1) 섹션 id와 좌석 스펙 매핑
section_specs AS (
    SELECT
      si.stadium_id,
      s.stadium,
      s.tier_txt,
      s.a_rows, s.a_cols, s.b_rows, s.b_cols, s.c_rows, s.c_cols
    FROM src s
    JOIN stadium_ids si ON si.name = s.stadium
),

-- 6) 좌석 생성 (row_no: R01.., col_no: 1..N)
make_seats_a AS (
    INSERT INTO seats (section_id, row_no, col_no)
    SELECT
      sec.section_id,
      TO_CHAR(gs_r, '"R"FM00'),
      gs_c::text
    FROM section_specs sp
    JOIN ins_sections sec ON sec.stadium_id = sp.stadium_id AND sec.name = 'A'
    CROSS JOIN LATERAL generate_series(1, sp.a_rows) AS gs_r
    CROSS JOIN LATERAL generate_series(1, sp.a_cols) AS gs_c
    ON CONFLICT (section_id, row_no, col_no) DO NOTHING
    RETURNING 1 AS done
),
make_seats_b AS (
    INSERT INTO seats (section_id, row_no, col_no)
    SELECT
      sec.section_id,
      TO_CHAR(gs_r, '"R"FM00'),
      gs_c::text
    FROM section_specs sp
    JOIN ins_sections sec ON sec.stadium_id = sp.stadium_id AND sec.name = 'B'
    CROSS JOIN LATERAL generate_series(1, sp.b_rows) AS gs_r
    CROSS JOIN LATERAL generate_series(1, sp.b_cols) AS gs_c
    ON CONFLICT (section_id, row_no, col_no) DO NOTHING
    RETURNING 1 AS done
),
make_seats_c AS (
    INSERT INTO seats (section_id, row_no, col_no)
    SELECT
      sec.section_id,
      TO_CHAR(gs_r, '"R"FM00'),
      gs_c::text
    FROM section_specs sp
    JOIN ins_sections sec ON sec.stadium_id = sp.stadium_id AND sec.name = 'C'
    CROSS JOIN LATERAL generate_series(1, sp.c_rows) AS gs_r
    CROSS JOIN LATERAL generate_series(1, sp.c_cols) AS gs_c
    ON CONFLICT (section_id, row_no, col_no) DO NOTHING
    RETURNING 1 AS done
)
SELECT
  (SELECT COUNT(*) FROM make_seats_a) +
  (SELECT COUNT(*) FROM make_seats_b) +
  (SELECT COUNT(*) FROM make_seats_c) AS inserted_seat_batches;

-- V4: Create sections & seats for stadiums used in matches that have none
SET lock_timeout = '5s';
SET client_min_messages = WARNING;
SET TIME ZONE 'UTC';

DO $$
DECLARE
  sid BIGINT;
  sec_id BIGINT;
  r INT;
  c INT;
BEGIN
  -- 모든 경기의 stadium_id 중, 아직 섹션이 없는 경기장부터 처리
  FOR sid IN
    SELECT DISTINCT m.stadium_id
    FROM matches m
    LEFT JOIN sections sec ON sec.stadium_id = m.stadium_id
    GROUP BY m.stadium_id
    HAVING COUNT(sec.section_id) = 0
  LOOP
    -- 섹션 3개 (A, B, C) 생성
    INSERT INTO sections(stadium_id, name, base_price)
    VALUES (sid, 'A', 20000),
           (sid, 'B', 30000),
           (sid, 'C', 40000)
    ON CONFLICT (stadium_id, name) DO NOTHING;

    -- 각 섹션에 좌석 5행(A~E) x 10열(1~10) 생성
    FOR sec_id IN SELECT section_id FROM sections WHERE stadium_id = sid LOOP
      FOR r IN 0..4 LOOP
        FOR c IN 1..10 LOOP
          INSERT INTO seats(section_id, row_no, col_no)
          VALUES (sec_id, CHR(65 + r), c::text)
          ON CONFLICT (section_id, row_no, col_no) DO NOTHING;
        END LOOP;
      END LOOP;
    END LOOP;
  END LOOP;
END $$;

-- V19__alter_users_extend_profile.sql

-- 1) 기본 계정 정보 확장
ALTER TABLE users ADD COLUMN IF NOT EXISTS login_id VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS name VARCHAR(50);
ALTER TABLE users ADD COLUMN IF NOT EXISTS phone VARCHAR(20);
ALTER TABLE users ADD COLUMN IF NOT EXISTS birth_date DATE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS profile_image_url VARCHAR(500);
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS favorite_club_id BIGINT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_reservation_done BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_recommend_match BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS notify_promotion BOOLEAN NOT NULL DEFAULT TRUE;

-- 2) 기존 데이터에 기본값 채우기 (더미 유저용)
UPDATE users
SET login_id  = COALESCE(login_id, CONCAT('user', id)),
    name      = COALESCE(name, nickname),
    email     = COALESCE(email, CONCAT('user', id, '@example.com'));

-- 3) NOT NULL + UNIQUE 제약 추가 (login_id, email은 로그인/연락 수단)
ALTER TABLE users
    ALTER COLUMN login_id SET NOT NULL,
    ALTER COLUMN email    SET NOT NULL;

ALTER TABLE users
    ADD CONSTRAINT uq_users_login_id UNIQUE (login_id),
    ADD CONSTRAINT uq_users_email    UNIQUE (email);

-- 4) favorite_club_id는 나중에 clubs 테이블이 준비되면 FK로 연결 가능
-- ALTER TABLE users
--     ADD CONSTRAINT fk_users_favorite_club
--         FOREIGN KEY (favorite_club_id) REFERENCES clubs (id);

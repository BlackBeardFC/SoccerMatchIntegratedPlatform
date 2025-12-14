-- V17__create_users.sql

CREATE TABLE IF NOT EXISTS users (
    id          BIGSERIAL       PRIMARY KEY,
    email       VARCHAR(255)    NOT NULL UNIQUE,
    password    VARCHAR(255)    NOT NULL,
    nickname    VARCHAR(50)     NOT NULL,

    role        VARCHAR(20)     NOT NULL DEFAULT 'USER',    -- 예: USER / ADMIN
    status      VARCHAR(20)     NOT NULL DEFAULT 'ACTIVE',  -- 예: ACTIVE / BLOCKED / DELETED

    created_at  TIMESTAMP       NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMP       NOT NULL DEFAULT NOW()
);

-- 이메일 검색 자주 할 거 대비 인덱스
CREATE INDEX IF NOT EXISTS idx_users_email
    ON users (email);

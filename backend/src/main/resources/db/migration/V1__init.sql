-- V1__init.sql (no ticketing)

SET lock_timeout = '5s';
SET client_min_messages = WARNING;
SET TIME ZONE 'UTC';

DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'match_status') THEN
        CREATE TYPE match_status AS ENUM ('SCHEDULED', 'LIVE', 'FINISHED', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'reservation_status') THEN
        CREATE TYPE reservation_status AS ENUM ('PENDING', 'EXPIRED', 'CONFIRMED', 'CANCELLED');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payment_status') THEN
        CREATE TYPE payment_status AS ENUM ('PENDING', 'SUCCESS', 'FAILED', 'CANCELLED');
    END IF;
END$$;

CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END; $$ LANGUAGE plpgsql;

-- 회원
CREATE TABLE IF NOT EXISTS members (
    member_id      BIGSERIAL PRIMARY KEY,
    email          TEXT NOT NULL UNIQUE,
    password_hash  TEXT NOT NULL,
    name           TEXT NOT NULL,
    role           TEXT NOT NULL DEFAULT 'USER',
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_members_updated BEFORE UPDATE ON members
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 팀/선수
CREATE TABLE IF NOT EXISTS teams (
    team_id    BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL UNIQUE,
    city       TEXT,
    logo_url   TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER trg_teams_updated BEFORE UPDATE ON teams
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS players (
    player_id  BIGSERIAL PRIMARY KEY,
    team_id    BIGINT NOT NULL REFERENCES teams(team_id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    position   TEXT,
    number     INT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (team_id, number)
);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE TRIGGER trg_players_updated BEFORE UPDATE ON players
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 경기장/구역/좌석
CREATE TABLE IF NOT EXISTS stadiums (
    stadium_id BIGSERIAL PRIMARY KEY,
    name       TEXT NOT NULL,
    address    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (name)
);
CREATE TRIGGER trg_stadiums_updated BEFORE UPDATE ON stadiums
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS sections (
    section_id BIGSERIAL PRIMARY KEY,
    stadium_id BIGINT NOT NULL REFERENCES stadiums(stadium_id) ON DELETE CASCADE,
    name       TEXT NOT NULL,
    base_price INT  NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (stadium_id, name)
);
CREATE INDEX IF NOT EXISTS idx_sections_stadium ON sections(stadium_id);
CREATE TRIGGER trg_sections_updated BEFORE UPDATE ON sections
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS seats (
    seat_id    BIGSERIAL PRIMARY KEY,
    section_id BIGINT NOT NULL REFERENCES sections(section_id) ON DELETE CASCADE,
    row_no     TEXT NOT NULL,
    col_no     TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (section_id, row_no, col_no)
);
CREATE INDEX IF NOT EXISTS idx_seats_section ON seats(section_id);
CREATE TRIGGER trg_seats_updated BEFORE UPDATE ON seats
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 경기
CREATE TABLE IF NOT EXISTS matches (
    match_id      BIGSERIAL PRIMARY KEY,
    stadium_id    BIGINT NOT NULL REFERENCES stadiums(stadium_id),
    home_team_id  BIGINT NOT NULL REFERENCES teams(team_id),
    away_team_id  BIGINT NOT NULL REFERENCES teams(team_id),
    start_at      TIMESTAMPTZ NOT NULL,
    status        match_status NOT NULL DEFAULT 'SCHEDULED',
    home_score    INT NOT NULL DEFAULT 0,
    away_score    INT NOT NULL DEFAULT 0,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (home_team_id <> away_team_id)
);
CREATE INDEX IF NOT EXISTS idx_matches_stadium ON matches(stadium_id);
CREATE INDEX IF NOT EXISTS idx_matches_start_at ON matches(start_at);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE TRIGGER trg_matches_updated BEFORE UPDATE ON matches
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 예매(좌석 홀드)
CREATE TABLE IF NOT EXISTS reservations (
    reservation_id  BIGSERIAL PRIMARY KEY,
    member_id       BIGINT NOT NULL REFERENCES members(member_id),
    match_id        BIGINT NOT NULL REFERENCES matches(match_id),
    status          reservation_status NOT NULL DEFAULT 'PENDING',
    hold_expires_at TIMESTAMPTZ,
    total_amount    BIGINT NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_reservations_member ON reservations(member_id);
CREATE INDEX IF NOT EXISTS idx_reservations_match ON reservations(match_id);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE TRIGGER trg_reservations_updated BEFORE UPDATE ON reservations
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS reservation_items (
    reservation_item_id BIGSERIAL PRIMARY KEY,
    reservation_id      BIGINT NOT NULL REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    seat_id             BIGINT NOT NULL REFERENCES seats(seat_id),
    price               INT NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (reservation_id, seat_id)
);
CREATE INDEX IF NOT EXISTS idx_reservation_items_reservation ON reservation_items(reservation_id);
CREATE INDEX IF NOT EXISTS idx_reservation_items_seat ON reservation_items(seat_id);

-- 결제(모의)
CREATE TABLE IF NOT EXISTS payments (
    payment_id     BIGSERIAL PRIMARY KEY,
    reservation_id BIGINT NOT NULL UNIQUE REFERENCES reservations(reservation_id) ON DELETE CASCADE,
    status         payment_status NOT NULL DEFAULT 'PENDING',
    method         TEXT,
    amount         BIGINT,
    paid_at        TIMESTAMPTZ,
    pg_tx_id       TEXT,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 좌석 잠금 보조 뷰
CREATE OR REPLACE VIEW v_match_seat_locks AS
SELECT
    m.match_id,
    s.seat_id,
    COALESCE(
        EXISTS (
            SELECT 1
            FROM reservations r
            JOIN reservation_items ri ON ri.reservation_id = r.reservation_id
            WHERE r.match_id = m.match_id
              AND ri.seat_id = s.seat_id
              AND (
                    r.status = 'CONFIRMED'
                 OR (r.status = 'PENDING' AND r.hold_expires_at IS NOT NULL AND r.hold_expires_at > NOW())
              )
        ),
        FALSE
    ) AS locked
FROM matches m
JOIN stadiums st ON st.stadium_id = m.stadium_id
JOIN sections sec ON sec.stadium_id = st.stadium_id
JOIN seats s ON s.section_id = sec.section_id;

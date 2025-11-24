CREATE TABLE match_popularity (
    match_id      BIGINT PRIMARY KEY REFERENCES matches(match_id),
    view_count    BIGINT NOT NULL DEFAULT 0,
    reservation_count BIGINT NOT NULL DEFAULT 0,
    last_viewed_at TIMESTAMPTZ
);

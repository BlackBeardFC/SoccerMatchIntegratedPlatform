CREATE TABLE inquiries (
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT      NOT NULL,
    user_nickname VARCHAR(50) NOT NULL,
    user_email    VARCHAR(100),

    title       VARCHAR(100) NOT NULL,
    content     TEXT         NOT NULL,

    status      VARCHAR(20)  NOT NULL,
    created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    answered_at TIMESTAMP WITHOUT TIME ZONE,
    answer      TEXT
);

CREATE INDEX idx_inquiries_created_at ON inquiries (created_at DESC);
CREATE INDEX idx_inquiries_status ON inquiries (status);

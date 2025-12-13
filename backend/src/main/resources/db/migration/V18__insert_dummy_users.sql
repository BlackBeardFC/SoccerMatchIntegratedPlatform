-- V18__insert_dummy_users.sql

INSERT INTO users (email, password, nickname, role, status)
VALUES
    ('user1@example.com', 'test1234', '테스트유저1', 'USER', 'ACTIVE'),
    ('user2@example.com', 'test1234', '테스트유저2', 'USER', 'ACTIVE'),
    ('admin@example.com', 'admin1234', '관리자', 'ADMIN', 'ACTIVE');

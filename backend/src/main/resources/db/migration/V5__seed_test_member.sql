-- V5: Seed a test member if none exists
SET lock_timeout = '5s';
SET client_min_messages = WARNING;
SET TIME ZONE 'UTC';

INSERT INTO members (email, password_hash, name, role)
SELECT 'test@example.com', '{noop}pass', 'Tester', 'USER'
WHERE NOT EXISTS (
    SELECT 1 FROM members WHERE email = 'test@example.com'
);

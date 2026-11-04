ALTER TABLE users
    ADD COLUMN password_reset_token_hash VARCHAR(64),
    ADD COLUMN password_reset_expires_at TIMESTAMPTZ,
    ADD COLUMN password_changed_at TIMESTAMPTZ,
    ADD COLUMN session_version INTEGER NOT NULL DEFAULT 0;

CREATE UNIQUE INDEX idx_users_password_reset_token_hash
    ON users(password_reset_token_hash)
    WHERE password_reset_token_hash IS NOT NULL;

CREATE TABLE auth_rate_limits (
    rate_key VARCHAR(64) PRIMARY KEY,
    failures INTEGER NOT NULL,
    window_started TIMESTAMPTZ NOT NULL,
    blocked_until TIMESTAMPTZ
);

CREATE INDEX idx_auth_rate_limits_expiry
    ON auth_rate_limits (blocked_until, window_started);

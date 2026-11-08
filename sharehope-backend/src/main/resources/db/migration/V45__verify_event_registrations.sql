ALTER TABLE event_registrations
    ADD COLUMN confirmation_token_hash VARCHAR(64),
    ADD COLUMN confirmation_expires_at TIMESTAMPTZ,
    ADD COLUMN confirmed_at TIMESTAMPTZ;

CREATE UNIQUE INDEX uk_event_registration_confirmation_token
    ON event_registrations (confirmation_token_hash)
    WHERE confirmation_token_hash IS NOT NULL;

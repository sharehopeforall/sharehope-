CREATE TABLE event_registrations (
    id UUID PRIMARY KEY,
    event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    email VARCHAR(320) NOT NULL,
    full_name VARCHAR(160) NOT NULL,
    guest_count INTEGER NOT NULL CHECK (guest_count BETWEEN 1 AND 10),
    pass_type VARCHAR(80) NOT NULL,
    locale VARCHAR(5) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT uk_event_registration_email UNIQUE (event_id, email)
);

CREATE INDEX idx_event_registrations_event_id ON event_registrations(event_id);

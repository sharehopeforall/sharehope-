ALTER TABLE event_registrations
    ADD COLUMN status VARCHAR(20) NOT NULL DEFAULT 'CONFIRMED',
    ADD COLUMN checked_in_at TIMESTAMPTZ;

CREATE INDEX idx_event_registrations_event_status ON event_registrations(event_id, status);

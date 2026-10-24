ALTER TABLE event_registrations
    ADD COLUMN registration_type VARCHAR(20) NOT NULL DEFAULT 'RSVP';

UPDATE event_registrations
SET registration_type = 'VOLUNTEER'
WHERE pass_type ILIKE 'Volunteer —%' OR pass_type ILIKE 'Volunteer -%';

ALTER TABLE event_registrations
    ADD CONSTRAINT chk_event_registration_type
    CHECK (registration_type IN ('RSVP', 'VOLUNTEER'));

CREATE INDEX idx_event_registrations_event_type
    ON event_registrations(event_id, registration_type);

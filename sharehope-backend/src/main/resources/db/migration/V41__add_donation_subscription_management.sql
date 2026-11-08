ALTER TABLE donations
    ADD COLUMN subscription_reference VARCHAR(200),
    ADD COLUMN subscription_status VARCHAR(30),
    ADD COLUMN cancellation_sent_at TIMESTAMPTZ;

CREATE INDEX idx_donations_subscription_reference
    ON donations(subscription_reference)
    WHERE subscription_reference IS NOT NULL;

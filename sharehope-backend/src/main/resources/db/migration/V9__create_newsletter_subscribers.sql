CREATE TABLE newsletter_subscribers (
    id             UUID PRIMARY KEY,
    email          VARCHAR(320) NOT NULL UNIQUE,
    locale         VARCHAR(5) NOT NULL DEFAULT 'en',
    subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_newsletter_subscribers_email_lower
    ON newsletter_subscribers (lower(email));

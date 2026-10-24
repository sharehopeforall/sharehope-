-- Adds the invitation/activation lifecycle fields to users, and makes
-- password_hash nullable since an invited user has no password until
-- they activate their account.

ALTER TABLE users
    ALTER COLUMN password_hash DROP NOT NULL;

ALTER TABLE users
    ADD COLUMN status                 VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    ADD COLUMN invitation_token_hash  VARCHAR(255),
    ADD COLUMN invitation_expires_at  TIMESTAMPTZ,
    ADD COLUMN invited_at             TIMESTAMPTZ,
    ADD COLUMN activated_at           TIMESTAMPTZ,
    ADD COLUMN invited_by             UUID REFERENCES users (id);

ALTER TABLE users
    ALTER COLUMN status DROP DEFAULT;

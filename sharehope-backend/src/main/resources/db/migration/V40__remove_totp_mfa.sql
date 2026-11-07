ALTER TABLE users DROP COLUMN IF EXISTS mfa_secret_encrypted;
ALTER TABLE users DROP COLUMN IF EXISTS mfa_enabled;

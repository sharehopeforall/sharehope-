UPDATE users
SET mfa_enabled = FALSE,
    mfa_secret_encrypted = NULL
WHERE mfa_enabled = TRUE OR mfa_secret_encrypted IS NOT NULL;

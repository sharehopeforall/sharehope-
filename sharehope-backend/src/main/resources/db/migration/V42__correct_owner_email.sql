UPDATE users
SET email = 'kristyn@sharehopeforall.org',
    session_version = session_version + 1,
    updated_at = NOW()
WHERE LOWER(email) = 'kristyn@sharehope.org'
  AND NOT EXISTS (
      SELECT 1
      FROM users existing
      WHERE LOWER(existing.email) = 'kristyn@sharehopeforall.org'
  );

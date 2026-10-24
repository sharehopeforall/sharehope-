-- Trim the seed roles down to just SUPER_ADMIN for now.
-- CONTENT_EDITOR and EVENT_MANAGER can be reintroduced later via a new migration.
DELETE FROM roles WHERE name IN ('CONTENT_EDITOR', 'EVENT_MANAGER');

-- Simplify admin roles down to exactly two: SUPER_ADMIN and CONTENT_EDITOR.
--
-- Note: EVENT_MANAGER (and, at the time, CONTENT_EDITOR) were already removed
-- by V3__remove_extra_roles.sql. This migration restores CONTENT_EDITOR and
-- guards against EVENT_MANAGER reappearing, so the end state is deterministic
-- regardless of which prior migrations a given environment has applied.

DELETE FROM user_roles
WHERE role_id IN (
    SELECT id FROM roles WHERE name = 'EVENT_MANAGER'
);

DELETE FROM roles WHERE name = 'EVENT_MANAGER';

INSERT INTO roles (name, description)
SELECT 'CONTENT_EDITOR', 'Can edit website content: programs, events, gallery, blog/news, testimonials, and team content'
WHERE NOT EXISTS (SELECT 1 FROM roles WHERE name = 'CONTENT_EDITOR');

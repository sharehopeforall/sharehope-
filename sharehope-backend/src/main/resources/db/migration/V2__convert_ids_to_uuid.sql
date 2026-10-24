-- Converts users/roles/user_roles primary/foreign keys from BIGSERIAL to UUID
-- to match the User/Role JPA entities.
--
-- There is no real user data yet (only the seed roles from V1), so the
-- simplest and safest approach is to drop and recreate these tables rather
-- than attempt an in-place bigint -> uuid conversion with no meaningful
-- mapping between old and new identifiers.
--
-- gen_random_uuid() is built into PostgreSQL core since version 13, no
-- extension required.

DROP TABLE IF EXISTS user_roles;
DROP TABLE IF EXISTS roles;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id     UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

INSERT INTO roles (name, description) VALUES
    ('SUPER_ADMIN', 'Full access to all admin dashboard features and settings'),
    ('CONTENT_EDITOR', 'Can create and edit site content (pages, posts, media)'),
    ('EVENT_MANAGER', 'Can create and manage events and event registrations');

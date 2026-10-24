-- Initial baseline migration for ShareHope backend.
-- Establishes the authentication/authorization foundation used by the admin dashboard:
--   users      -> people who can log into the admin dashboard
--   roles      -> named permission levels (e.g. SUPER_ADMIN, CONTENT_EDITOR, EVENT_MANAGER)
--   user_roles -> join table implementing the many-to-many relationship between users and roles

CREATE TABLE users (
    id            BIGSERIAL PRIMARY KEY,
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name    VARCHAR(100) NOT NULL,
    last_name     VARCHAR(100) NOT NULL,
    is_active     BOOLEAN NOT NULL DEFAULT TRUE,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE roles (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(255),
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE user_roles (
    user_id     BIGINT NOT NULL REFERENCES users (id) ON DELETE CASCADE,
    role_id     BIGINT NOT NULL REFERENCES roles (id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX idx_user_roles_role_id ON user_roles (role_id);

INSERT INTO roles (name, description) VALUES
    ('SUPER_ADMIN', 'Full access to all admin dashboard features and settings'),
    ('CONTENT_EDITOR', 'Can create and edit site content (pages, posts, media)'),
    ('EVENT_MANAGER', 'Can create and manage events and event registrations');

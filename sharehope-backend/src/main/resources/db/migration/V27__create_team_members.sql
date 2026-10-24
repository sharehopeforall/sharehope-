CREATE TABLE team_members (
    id UUID PRIMARY KEY,
    full_name VARCHAR(160) NOT NULL,
    job_title VARCHAR(160) NOT NULL,
    department VARCHAR(120),
    start_date DATE,
    status VARCHAR(30) NOT NULL,
    work_email VARCHAR(320),
    phone VARCHAR(60),
    location VARCHAR(160),
    manager_name VARCHAR(160),
    notes TEXT,
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL,
    CONSTRAINT team_members_status_check CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'FORMER'))
);

CREATE INDEX idx_team_members_status ON team_members(status);
CREATE INDEX idx_team_members_full_name ON team_members(full_name);

CREATE TABLE public_submissions (
 id UUID PRIMARY KEY, submission_type VARCHAR(30) NOT NULL, first_name VARCHAR(100) NOT NULL,
 last_name VARCHAR(100) NOT NULL, email VARCHAR(320) NOT NULL, phone VARCHAR(40),
 organization VARCHAR(200), subject VARCHAR(200), details TEXT NOT NULL, locale VARCHAR(5) NOT NULL,
 status VARCHAR(20) NOT NULL DEFAULT 'NEW', created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_public_submissions_type_created ON public_submissions (submission_type, created_at DESC);

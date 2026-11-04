ALTER TABLE public_submissions
    ADD COLUMN status_updated_at TIMESTAMPTZ,
    ADD COLUMN status_updated_by UUID REFERENCES users(id) ON DELETE SET NULL;

CREATE INDEX idx_public_submissions_status_updated
    ON public_submissions (status, status_updated_at);

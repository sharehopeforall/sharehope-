ALTER TABLE public_submissions
    ADD COLUMN assigned_coordinator VARCHAR(200),
    ADD COLUMN internal_notes TEXT;

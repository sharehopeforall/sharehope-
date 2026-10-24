CREATE TABLE visual_page_content (
    id UUID PRIMARY KEY,
    page_path VARCHAR(255) NOT NULL,
    locale VARCHAR(10) NOT NULL,
    draft_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    published_content JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_visual_page_path_locale UNIQUE (page_path, locale),
    CONSTRAINT chk_visual_page_locale CHECK (locale IN ('en', 'fr'))
);

CREATE INDEX idx_visual_page_content_path_locale ON visual_page_content(page_path, locale);

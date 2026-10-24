CREATE TABLE pages (
    id UUID PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(150) NOT NULL UNIQUE,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT chk_page_status
        CHECK (status IN ('DRAFT', 'PUBLISHED'))
);


CREATE TABLE page_sections (
    id UUID PRIMARY KEY,

    page_id UUID NOT NULL,

    section_key VARCHAR(100) NOT NULL,
    section_type VARCHAR(50) NOT NULL,

    display_order INTEGER NOT NULL DEFAULT 0,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    settings JSONB NOT NULL DEFAULT '{}'::jsonb,

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_page_section_page
        FOREIGN KEY (page_id)
        REFERENCES pages(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_page_section_key
        UNIQUE (page_id, section_key)
);


CREATE TABLE page_section_translations (
    id UUID PRIMARY KEY,

    page_section_id UUID NOT NULL,

    locale VARCHAR(10) NOT NULL,

    title TEXT,
    subtitle TEXT,
    body TEXT,
    button_text VARCHAR(150),

    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,

    CONSTRAINT fk_section_translation_section
        FOREIGN KEY (page_section_id)
        REFERENCES page_sections(id)
        ON DELETE CASCADE,

    CONSTRAINT uq_section_translation_locale
        UNIQUE (page_section_id, locale),

    CONSTRAINT chk_section_translation_locale
        CHECK (locale IN ('en', 'fr'))
);


CREATE INDEX idx_page_sections_page_id
ON page_sections(page_id);

CREATE INDEX idx_page_sections_display_order
ON page_sections(page_id, display_order);

CREATE INDEX idx_page_section_translation_section
ON page_section_translations(page_section_id);

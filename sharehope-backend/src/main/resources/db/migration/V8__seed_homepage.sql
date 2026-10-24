INSERT INTO pages (
    id,
    name,
    slug,
    status,
    published_at,
    created_at,
    updated_at
)
VALUES (
    gen_random_uuid(),
    'Home',
    '/',
    'PUBLISHED',
    NOW(),
    NOW(),
    NOW()
);

INSERT INTO page_sections (
    id,
    page_id,
    section_key,
    section_type,
    display_order,
    enabled,
    settings,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    id,
    'hero',
    'HERO',
    1,
    TRUE,
    '{
        "ctaUrl": "/donate",
        "photo1Url": null,
        "photo2Url": null,
        "photo3Url": null,
        "photo4Url": null,
        "showSecureMessage": true
    }'::jsonb,
    NOW(),
    NOW()
FROM pages
WHERE slug = '/';

INSERT INTO page_sections (
    id,
    page_id,
    section_key,
    section_type,
    display_order,
    enabled,
    settings,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    pages.id,
    section_key,
    section_type,
    display_order,
    TRUE,
    '{}'::jsonb,
    NOW(),
    NOW()
FROM pages
CROSS JOIN (
    VALUES
        ('mission', 'MISSION', 2),
        ('impact', 'IMPACT', 3),
        ('programs', 'PROGRAMS', 4),
        ('events', 'EVENTS', 5),
        ('testimonials', 'TESTIMONIALS', 6),
        ('get-involved', 'GET_INVOLVED', 7),
        ('partners', 'PARTNERS', 8),
        ('newsletter', 'NEWSLETTER', 9)
) AS sections(section_key, section_type, display_order)
WHERE pages.slug = '/';

INSERT INTO page_section_translations (
    id,
    page_section_id,
    locale,
    title,
    body,
    button_text,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    id,
    'en',
    'Give Hope. Change a Future.',
    'Your support helps children and young adults access education, clean water, and opportunities to build a brighter tomorrow.',
    'Donate Now',
    NOW(),
    NOW()
FROM page_sections
WHERE section_key = 'hero';

INSERT INTO page_section_translations (
    id,
    page_section_id,
    locale,
    title,
    body,
    button_text,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    id,
    'fr',
    'Donnez de l''espoir. Changez un avenir.',
    'Votre soutien aide les enfants et les jeunes adultes à accéder à l''éducation, aux ressources essentielles et aux opportunités.',
    'Faire un don',
    NOW(),
    NOW()
FROM page_sections
WHERE section_key = 'hero';

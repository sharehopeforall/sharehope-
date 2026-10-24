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
    'education',
    'PROGRAMS',
    10,
    TRUE,
    '{}'::jsonb,
    NOW(),
    NOW()
FROM pages
WHERE pages.slug = '/'
  AND NOT EXISTS (
      SELECT 1
      FROM page_sections existing
      WHERE existing.page_id = pages.id
        AND existing.section_key = 'education'
  );

INSERT INTO page_section_translations (
    id,
    page_section_id,
    locale,
    title,
    subtitle,
    body,
    button_text,
    created_at,
    updated_at
)
SELECT
    gen_random_uuid(),
    section.id,
    translation.locale,
    translation.title,
    translation.subtitle,
    translation.body,
    translation.button_text,
    NOW(),
    NOW()
FROM page_sections section
CROSS JOIN (
    VALUES
        (
            'en',
            'Opportunity begins with access.',
            'Why education?',
            'For many families, the cost of school supplies, tuition, or transportation can put education out of reach.',
            'Support education'
        ),
        (
            'fr',
            'Les possibilités commencent par l’accès.',
            'Pourquoi l’éducation ?',
            'Pour de nombreuses familles, le coût du matériel scolaire, des frais de scolarité ou du transport peut rendre l’éducation inaccessible.',
            'Soutenir l’éducation'
        )
) AS translation(locale, title, subtitle, body, button_text)
WHERE section.section_key = 'education'
  AND NOT EXISTS (
      SELECT 1
      FROM page_section_translations existing
      WHERE existing.page_section_id = section.id
        AND existing.locale = translation.locale
  );

INSERT INTO page_sections (
    id, page_id, section_key, section_type, display_order, enabled, settings, created_at, updated_at
)
SELECT
    gen_random_uuid(), id, 'need', 'IMPACT', 4, TRUE,
    '{"ctaUrl":"/donate"}'::jsonb, NOW(), NOW()
FROM pages
WHERE slug = '/'
  AND NOT EXISTS (
      SELECT 1 FROM page_sections existing
      WHERE existing.page_id = pages.id AND existing.section_key = 'need'
  );

UPDATE page_sections
SET display_order = display_order + 1
WHERE section_key IN ('programs', 'events', 'testimonials', 'get-involved', 'partners', 'newsletter');

INSERT INTO page_section_translations (
    id, page_section_id, locale, title, subtitle, body, button_text, created_at, updated_at
)
SELECT gen_random_uuid(), id, 'en',
       'Millions of children and young adults still lack the opportunity to thrive.',
       'The Need Is Real',
       'We support children, young adults, and families with education, food assistance, life skills, and essential resources, helping them build healthier, more independent futures.',
       'Give Today', NOW(), NOW()
FROM page_sections WHERE section_key = 'need';

INSERT INTO page_section_translations (
    id, page_section_id, locale, title, subtitle, body, button_text, created_at, updated_at
)
SELECT gen_random_uuid(), id, 'fr',
       'Des millions d''enfants et de jeunes adultes n''ont toujours pas la possibilité de s''épanouir.',
       'Le besoin est bien réel',
       'Nous soutenons les enfants, les jeunes adultes et les familles par l''éducation, l''aide alimentaire, les compétences de vie et les ressources essentielles, afin de les aider à bâtir un avenir plus sain et plus autonome.',
       'Donnez aujourd''hui', NOW(), NOW()
FROM page_sections WHERE section_key = 'need';

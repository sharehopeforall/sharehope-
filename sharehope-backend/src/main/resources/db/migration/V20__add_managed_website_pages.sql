INSERT INTO pages (id, name, slug, status, published_at, created_at, updated_at)
SELECT gen_random_uuid(), seed.name, seed.slug, 'PUBLISHED', NOW(), NOW(), NOW()
FROM (VALUES
  ('About', '/about'),
  ('Our Story', '/about/our-story'),
  ('Founder', '/about/founder'),
  ('Team', '/about/team'),
  ('Donate', '/donate'),
  ('Volunteer', '/volunteer'),
  ('Partner', '/partner'),
  ('Privacy Policy', '/privacy'),
  ('Navigation & Footer', '/_navigation-footer'),
  ('SEO & Social', '/_seo-social')
) AS seed(name, slug)
WHERE NOT EXISTS (SELECT 1 FROM pages existing WHERE existing.slug = seed.slug);

INSERT INTO page_sections (id, page_id, section_key, section_type, display_order, enabled, settings, created_at, updated_at)
SELECT gen_random_uuid(), page.id, 'content', 'CONTENT', 1, TRUE, '{}'::jsonb, NOW(), NOW()
FROM pages page
WHERE page.slug IN ('/about','/about/our-story','/about/founder','/about/team','/donate','/volunteer','/partner','/privacy','/_navigation-footer','/_seo-social')
AND NOT EXISTS (SELECT 1 FROM page_sections section WHERE section.page_id = page.id AND section.section_key = 'content');

INSERT INTO page_section_translations (id, page_section_id, locale, title, subtitle, body, button_text, created_at, updated_at)
SELECT gen_random_uuid(), section.id, locale.code, NULL, NULL, NULL, NULL, NOW(), NOW()
FROM page_sections section
JOIN pages page ON page.id = section.page_id
CROSS JOIN (VALUES ('en'), ('fr')) AS locale(code)
WHERE section.section_key = 'content'
AND page.slug IN ('/about','/about/our-story','/about/founder','/about/team','/donate','/volunteer','/partner','/privacy','/_navigation-footer','/_seo-social')
AND NOT EXISTS (SELECT 1 FROM page_section_translations translation WHERE translation.page_section_id = section.id AND translation.locale = locale.code);

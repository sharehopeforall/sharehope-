UPDATE page_section_translations translation
SET body = NULL,
    updated_at = NOW()
FROM page_sections section,
     pages page
WHERE translation.page_section_id = section.id
  AND section.page_id = page.id
  AND page.slug = '/'
  AND section.section_key = 'mission'
  AND translation.locale = 'en'
  AND translation.body = 'ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives.';

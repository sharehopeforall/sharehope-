UPDATE visual_page_content
SET draft_content = COALESCE((
        SELECT jsonb_object_agg(entry.key, entry.value)
        FROM jsonb_each(draft_content) entry
        WHERE NOT (
            entry.value ->> 'type' = 'text'
            AND (
                entry.value ->> 'selector' IN (
                    '[data-visual-key="auto-2lw9w1"]',
                    '#visual-page-root > main:nth-of-type(1) > section:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > p:nth-of-type(1)'
                )
                OR LOWER(entry.value ->> 'value') LIKE 'sharehope empowers underserved children and young adults%'
                OR LOWER(entry.value ->> 'value') LIKE 'sharehope aide les enfants et les jeunes adultes défavorisés%'
            )
        )
    ), '{}'::jsonb),
    published_content = COALESCE((
        SELECT jsonb_object_agg(entry.key, entry.value)
        FROM jsonb_each(published_content) entry
        WHERE NOT (
            entry.value ->> 'type' = 'text'
            AND (
                entry.value ->> 'selector' IN (
                    '[data-visual-key="auto-2lw9w1"]',
                    '#visual-page-root > main:nth-of-type(1) > section:nth-of-type(3) > div:nth-of-type(1) > div:nth-of-type(1) > p:nth-of-type(1)'
                )
                OR LOWER(entry.value ->> 'value') LIKE 'sharehope empowers underserved children and young adults%'
                OR LOWER(entry.value ->> 'value') LIKE 'sharehope aide les enfants et les jeunes adultes défavorisés%'
            )
        )
    ), '{}'::jsonb),
    updated_at = NOW()
WHERE page_path = '/'
  AND locale IN ('en', 'fr');

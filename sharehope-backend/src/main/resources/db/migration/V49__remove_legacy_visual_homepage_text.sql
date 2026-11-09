UPDATE visual_page_content
SET draft_content = COALESCE((
        SELECT jsonb_object_agg(entry.key, entry.value)
        FROM jsonb_each(draft_content) entry
        WHERE RTRIM(entry.value ->> 'value', '. ') <> 'ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives'
    ), '{}'::jsonb),
    published_content = COALESCE((
        SELECT jsonb_object_agg(entry.key, entry.value)
        FROM jsonb_each(published_content) entry
        WHERE RTRIM(entry.value ->> 'value', '. ') <> 'ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives'
    ), '{}'::jsonb),
    updated_at = NOW()
WHERE page_path = '/'
  AND locale = 'en'
  AND (
      EXISTS (
          SELECT 1
          FROM jsonb_each(draft_content) entry
          WHERE RTRIM(entry.value ->> 'value', '. ') = 'ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives'
      )
      OR EXISTS (
          SELECT 1
          FROM jsonb_each(published_content) entry
          WHERE RTRIM(entry.value ->> 'value', '. ') = 'ShareHope empowers underserved children and young adults through education, life skills development, and access to essential resources, helping them build more independent and hope-filled lives'
      )
  );

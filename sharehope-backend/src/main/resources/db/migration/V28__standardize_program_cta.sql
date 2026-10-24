UPDATE programs
SET translations = jsonb_set(
        jsonb_set(translations, '{en,buttonText}', '"Learn more"'::jsonb, true),
        '{fr,buttonText}', '"En savoir plus"'::jsonb, true
    ),
    updated_at = NOW();

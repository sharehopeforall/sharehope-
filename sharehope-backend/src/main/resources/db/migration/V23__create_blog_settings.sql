CREATE TABLE blog_settings (
    id INTEGER PRIMARY KEY,
    translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

INSERT INTO blog_settings (id, translations, updated_at) VALUES (
    1,
    '{"en":{"eyebrow":"Stories & updates","title":"The ShareHope Blog","lead":"Field notes, program updates, and the stories behind the work — written by our team and the communities we serve.","featuredLabel":"Featured story","newsletterTitle":"Get stories like these in your inbox","newsletterBody":"Monthly field updates, no spam — just the good stuff.","newsletterCta":"Subscribe to the newsletter","emptyState":"No stories in this category yet."},"fr":{"eyebrow":"Histoires et nouvelles","title":"Le blogue ShareHope","lead":"Notes de terrain, nouvelles des programmes et les histoires derrière le travail — écrites par notre équipe et les communautés que nous servons.","featuredLabel":"Histoire à la une","newsletterTitle":"Recevez ces histoires dans votre boîte","newsletterBody":"Des nouvelles du terrain chaque mois, sans pourriel — juste l’essentiel.","newsletterCta":"S’abonner à l’infolettre","emptyState":"Aucune histoire dans cette catégorie pour l’instant."}}'::jsonb,
    NOW()
);

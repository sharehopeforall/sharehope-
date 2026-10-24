UPDATE blog_posts
SET status = 'DRAFT', published_at = NULL, updated_at = NOW()
WHERE slug IN (
    'when-a-classroom-becomes-a-community',
    'clean-water-stronger-futures',
    'meet-the-people-behind-the-work'
);

UPDATE blog_posts
SET translations = translations || jsonb_build_object('fr', translations -> 'en')
WHERE slug IN (
    'what-keeps-a-student-learning',
    'health-starts-close-to-home',
    'why-local-mentors-matter',
    'what-community-led-means',
    'small-barriers-big-difference',
    'measuring-progress-with-dignity'
)
AND NOT (translations ? 'fr');

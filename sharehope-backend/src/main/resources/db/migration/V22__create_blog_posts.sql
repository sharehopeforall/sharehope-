CREATE TABLE blog_posts (
    id UUID PRIMARY KEY,
    slug VARCHAR(180) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    format VARCHAR(20) NOT NULL DEFAULT 'ARTICLE',
    status VARCHAR(20) NOT NULL DEFAULT 'DRAFT',
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    display_order INTEGER NOT NULL DEFAULT 0,
    cover_image_url TEXT,
    video_url TEXT,
    duration_seconds INTEGER,
    related_program_slug VARCHAR(180),
    published_at TIMESTAMP WITH TIME ZONE,
    translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    CONSTRAINT chk_blog_post_format CHECK (format IN ('ARTICLE', 'VIDEO')),
    CONSTRAINT chk_blog_post_status CHECK (status IN ('DRAFT', 'PUBLISHED')),
    CONSTRAINT chk_blog_post_duration CHECK (duration_seconds IS NULL OR duration_seconds > 0),
    CONSTRAINT chk_blog_post_video_url CHECK (format <> 'VIDEO' OR video_url IS NOT NULL)
);

CREATE INDEX idx_blog_posts_public
    ON blog_posts(status, featured DESC, published_at DESC, display_order);

CREATE INDEX idx_blog_posts_category
    ON blog_posts(category);

INSERT INTO blog_posts (
    id, slug, category, format, status, featured, display_order,
    cover_image_url, related_program_slug, published_at, translations, created_at, updated_at
) VALUES (
    gen_random_uuid(),
    'when-a-classroom-becomes-a-community',
    'Education',
    'ARTICLE',
    'PUBLISHED',
    TRUE,
    1,
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1600&q=85',
    'education-access',
    NOW(),
    '{"en":{"title":"When a classroom becomes a community","excerpt":"Inside a learning space where students, teachers, and families are building opportunity together.","body":"A classroom can be more than four walls. With the right resources and committed local leadership, it becomes a place where confidence grows, families connect, and young people begin to imagine what comes next.","imageAlt":"Students learning together in a bright classroom","buttonText":"Read the story","authorName":"ShareHope Editorial Team","seoTitle":"When a Classroom Becomes a Community | ShareHope","seoDescription":"See how community-led education creates lasting opportunity for students and families.","tags":["Education","Community","Stories"]}}'::jsonb,
    NOW(),
    NOW()
), (
    gen_random_uuid(),
    'clean-water-stronger-futures',
    'Health',
    'ARTICLE',
    'PUBLISHED',
    FALSE,
    2,
    'https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1600&q=85',
    'health-wellness',
    NOW() - INTERVAL '7 days',
    '{"en":{"title":"Clean water, stronger futures","excerpt":"How reliable access to water gives families more time for health, school, and work.","body":"Reliable clean water changes the rhythm of daily life. It reduces preventable illness, allows children to spend more time in school, and gives families the stability to plan for the future.","imageAlt":"A community member collecting clean water","buttonText":"Read the story","authorName":"ShareHope Field Team","seoTitle":"Clean Water, Stronger Futures | ShareHope","seoDescription":"Learn how access to clean water improves health, education, and economic opportunity.","tags":["Health","Clean Water","Impact"]}}'::jsonb,
    NOW(),
    NOW()
), (
    gen_random_uuid(),
    'meet-the-people-behind-the-work',
    'Field Notes',
    'ARTICLE',
    'PUBLISHED',
    FALSE,
    3,
    'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1600&q=85',
    'community-development',
    NOW() - INTERVAL '14 days',
    '{"en":{"title":"Meet the people behind the work","excerpt":"Local leaders share what partnership looks like in their communities.","body":"The strongest programs begin with listening. Our partners bring local knowledge, trusted relationships, and a clear understanding of what their communities need to thrive.","imageAlt":"Community volunteers working together","buttonText":"Read the story","authorName":"ShareHope Editorial Team","seoTitle":"Meet the People Behind the Work | ShareHope","seoDescription":"Meet the local leaders and volunteers guiding ShareHope community programs.","tags":["Field Notes","Partnership","Community"]}}'::jsonb,
    NOW(),
    NOW()
);

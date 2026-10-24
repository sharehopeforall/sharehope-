CREATE TABLE programs (
    id UUID PRIMARY KEY,
    slug VARCHAR(150) NOT NULL UNIQUE,
    category VARCHAR(80) NOT NULL,
    display_order INTEGER NOT NULL DEFAULT 0,
    published BOOLEAN NOT NULL DEFAULT FALSE,
    featured BOOLEAN NOT NULL DEFAULT FALSE,
    image_url TEXT,
    translations JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL
);

CREATE INDEX idx_programs_public_order ON programs(published, display_order);

INSERT INTO programs (id, slug, category, display_order, published, featured, image_url, translations, created_at, updated_at)
VALUES
(gen_random_uuid(), 'education-access', 'education', 1, TRUE, TRUE,
 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
 '{"en":{"title":"Education Access","description":"We believe that education is the most powerful catalyst for change. Our education programs remove barriers to learning through school supplies, scholarships, and safe learning centers.","buttonText":"Support Education","imageAlt":"Education Access","initiatives":["Essential School Supplies & Solar Learning Tablets Distribution","Full & Partial Tuition Scholarships for Vulnerable Youth","Modern Learning Center Construction & Certified Teacher Training"]},"fr":{"title":"Accès à l’éducation","description":"Nous croyons que l’éducation est le catalyseur le plus puissant du changement. Nos programmes éliminent les obstacles à l’apprentissage grâce aux fournitures scolaires, aux bourses et aux centres d’apprentissage sûrs.","buttonText":"Soutenir l’éducation","imageAlt":"Accès à l’éducation","initiatives":["Distribution de fournitures scolaires et de tablettes solaires","Bourses d’études pour les jeunes vulnérables","Construction de centres d’apprentissage et formation d’enseignants"]}}'::jsonb, NOW(), NOW()),
(gen_random_uuid(), 'health-wellness', 'health', 2, TRUE, FALSE,
 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80',
 '{"en":{"title":"Health & Wellness","description":"We partner with local healthcare providers to host mobile clinics, distribute nutritional support, and provide wellness and clean-water education.","buttonText":"Support Health","imageAlt":"Health and Wellness","initiatives":["Mobile Medical Clinics & Maternal Care","Nutritional Support & Emergency Meals","Water Well Maintenance & Hygiene Workshops"]},"fr":{"title":"Santé et bien-être","description":"Nous collaborons avec des fournisseurs de soins locaux pour organiser des cliniques mobiles, distribuer du soutien nutritionnel et offrir une éducation sur le bien-être et l’eau potable.","buttonText":"Soutenir la santé","imageAlt":"Santé et bien-être","initiatives":["Cliniques mobiles et soins maternels","Soutien nutritionnel et repas d’urgence","Entretien des puits et ateliers d’hygiène"]}}'::jsonb, NOW(), NOW()),
(gen_random_uuid(), 'community-development', 'community', 3, TRUE, FALSE,
 'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80',
 '{"en":{"title":"Community Development","description":"We build youth mentorship networks, vocational workshops, and family support groups that help people become independent community leaders.","buttonText":"Support Community","imageAlt":"Community Development","initiatives":["Youth Mentorship & Leadership Networks","Vocational & Technical Apprenticeships","Family Support & Entrepreneurship Groups"]},"fr":{"title":"Développement communautaire","description":"Nous bâtissons des réseaux de mentorat, des ateliers professionnels et des groupes de soutien familial qui aident les personnes à devenir des leaders autonomes.","buttonText":"Soutenir la communauté","imageAlt":"Développement communautaire","initiatives":["Réseaux de mentorat et de leadership","Apprentissages professionnels et techniques","Groupes de soutien familial et d’entrepreneuriat"]}}'::jsonb, NOW(), NOW());

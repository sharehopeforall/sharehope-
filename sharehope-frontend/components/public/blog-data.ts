export type CategoryId = "all" | "education" | "health" | "community" | "field-notes";

export interface Post {
  slug: string;
  category: Exclude<CategoryId, "all">;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  image: string;
  imageAlt: string;
  format?: "ARTICLE" | "VIDEO";
  videoUrl?: string | null;
  durationSeconds?: number | null;
  authorName?: string;
  body?: readonly string[];
}

export const copy = {
  en: {
    eyebrow: "Stories & updates",
    title: "The ShareHope Blog",
    lead: "Practical updates from our education, health, and community programs — grounded in local leadership, dignity, and lasting partnership.",
    featuredLabel: "Featured story",
    categories: {
      all: "All stories",
      education: "Education",
      health: "Health",
      community: "Community",
      "field-notes": "Field notes",
    },
    readMore: "Read more",
    posts: [
      {
        slug: "what-keeps-a-student-learning",
        category: "education",
        title: "What keeps a student learning?",
        excerpt: "School access is rarely about one barrier. Supplies, tuition support, safe classrooms, trained teachers, and encouragement all help students keep moving forward.",
        date: "Sep 18, 2026",
        readTime: "6 min read",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Students learning together in a bright classroom",
        body: [
          "For many families, a uniform, notebook, tuition payment, or long trip to school can place learning out of reach. Those barriers may look small individually, but together they can determine whether a student returns to class.",
          "ShareHope works alongside local educators and families to understand what students need in their own context. That can mean school supplies, scholarship support, safer learning spaces, teacher training, or a trusted mentor who helps a young person keep going.",
          "The goal is not simply attendance. Consistent access to education gives students structure, confidence, community, and more freedom to shape their own futures.",
        ],
      },
      {
        slug: "health-starts-close-to-home",
        category: "health",
        title: "Health starts close to home",
        excerpt: "Mobile clinics, clean water systems, nutrition support, and practical health education work best when communities help shape how care is delivered.",
        date: "Sep 5, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        imageAlt: "A clean-water source serving a rural community",
        body: [
          "Healthcare can be difficult to reach when the nearest clinic is hours—or even days—away. Reliable water, preventive care, and nutrition support therefore become essential parts of a community’s health system.",
          "ShareHope partners with local providers and leaders on mobile clinics, maternal care, water-well maintenance, filtration, hygiene education, and nutrition programs. Each effort responds to priorities identified by the people who will use it.",
          "This locally guided approach helps practical resources fit daily life and strengthens the systems communities already trust.",
        ],
      },
      {
        slug: "why-local-mentors-matter",
        category: "community",
        title: "Why local mentors matter",
        excerpt: "Mentorship connects education, work, and leadership by giving young people consistent guidance from someone who understands their community.",
        date: "Aug 28, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
        imageAlt: "A local mentor speaking with a student",
        body: [
          "Resources can open a door, but trusted relationships often help a young person walk through it. Local mentors understand the pressures students and young adults face because they know the schools, families, and opportunities around them.",
          "ShareHope’s community-development work supports mentorship networks alongside vocational training, family support, and entrepreneurship. These programs are designed to help people move from receiving support to leading on their own terms.",
          "A strong mentorship network lasts beyond any single project: today’s participant can become tomorrow’s guide, employer, or community leader.",
        ],
      },
      {
        slug: "what-community-led-means",
        category: "field-notes",
        title: "What community-led really means",
        excerpt: "It begins with a simple discipline: arrive with questions, listen to local priorities, and build around the knowledge already present.",
        date: "Aug 14, 2026",
        readTime: "7 min read",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Community partners planning a local program together",
        body: [
          "Community-led is more than a phrase. It changes who defines the problem, who chooses the response, and who owns the result. ShareHope’s role is to bring resources and sustained partnership—not arrive with a finished answer.",
          "Local leaders help identify priorities, shape program delivery, and explain what progress should look like. Their knowledge influences everything from clinic schedules to learning-center design and vocational opportunities.",
          "Listening first takes patience, but it produces programs that are more relevant, more trusted, and more likely to last.",
        ],
      },
      {
        slug: "small-barriers-big-difference",
        category: "education",
        title: "Small barriers can make a big difference",
        excerpt: "A notebook, uniform, transportation cost, or tuition fee can determine whether a child is able to stay connected to school.",
        date: "Jul 30, 2026",
        readTime: "5 min read",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
        imageAlt: "A teacher supporting students in a classroom",
        body: [
          "Educational opportunity is shaped by practical details. When a family must choose between essential household needs and the cost of school, even a modest expense can interrupt a student’s learning.",
          "That is why ShareHope’s education work combines direct student support with investment in teachers and safe learning spaces. No single intervention solves every challenge, so programs are developed with communities to address the barriers they see most often.",
          "Removing one barrier creates room for the next hopeful step: another lesson, another term, and another chance for a student to imagine what comes next.",
        ],
      },
      {
        slug: "measuring-progress-with-dignity",
        category: "field-notes",
        title: "Measuring progress with dignity",
        excerpt: "Numbers matter, but community feedback helps us understand whether a program is useful, respectful, and creating the kind of change people actually value.",
        date: "Jul 16, 2026",
        readTime: "4 min read",
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Community members sharing feedback in conversation",
        body: [
          "Good reporting should show where resources went and what they helped accomplish. It should also make space for the experience and judgment of the people a program is intended to serve.",
          "ShareHope considers participation, access, and practical outcomes while listening closely to community feedback. That feedback can reveal whether support arrived at the right time, respected local priorities, and strengthened people’s ability to make their own choices.",
          "Accountability is not only about counting activity. It is about learning, adjusting, and honoring the dignity of every person represented by the numbers.",
        ],
      },
    ] satisfies Post[],
    newsletterTitle: "Get stories like these in your inbox",
    newsletterBody: "Receive thoughtful program updates and practical stories from the communities guiding this work.",
    newsletterCta: "Subscribe to the newsletter",
    emptyState: "No stories in this category yet.",
  },
  fr: {
    eyebrow: "Histoires et nouvelles",
    title: "Le blogue ShareHope",
    lead: "Notes de terrain, nouvelles des programmes et les histoires derrière le travail — écrites par notre équipe et les communautés que nous servons.",
    featuredLabel: "Histoire à la une",
    categories: {
      all: "Toutes les histoires",
      education: "Éducation",
      health: "Santé",
      community: "Communauté",
      "field-notes": "Notes de terrain",
    },
    readMore: "Lire la suite",
    posts: [
      {
        slug: "classroom-that-changed-everything",
        category: "education",
        title: "La classe qui a tout changé",
        excerpt: "Il y a dix ans, quarante élèves partageaient douze manuels. Ce printemps, cette même école a vu sa plus grande promotion — dont ses premiers élèves admis à l'université.",
        date: "18 sept. 2026",
        readTime: "6 min de lecture",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des élèves dans une salle de classe lumineuse",
      },
      {
        slug: "clean-water-boulsa",
        category: "health",
        title: "L'eau potable arrive à Boulsa",
        excerpt: "Après des mois de planification avec les leaders locaux, le nouveau puits du village est ouvert — et l'effet s'est vu dans les chiffres de la clinique en quelques semaines.",
        date: "5 sept. 2026",
        readTime: "4 min de lecture",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Une pompe à eau dans un champ",
      },
      {
        slug: "mentors-shaping-tomorrow",
        category: "community",
        title: "Rencontrez les mentors qui façonnent demain",
        excerpt: "Derrière chaque boursier se cache un mentor local qui prend des nouvelles chaque semaine. Nous avons rencontré trois d'entre eux.",
        date: "28 août 2026",
        readTime: "5 min de lecture",
        image: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Un mentor discute avec un élève",
      },
      {
        slug: "mobile-clinic-week",
        category: "field-notes",
        title: "Notes de terrain : une semaine avec la clinique mobile",
        excerpt: "Notre coordinatrice santé a accompagné la clinique mobile pendant une semaine. Trois villages, deux crevaisons et une naissance inoubliable — voici son récit.",
        date: "14 août 2026",
        readTime: "7 min de lecture",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Une travailleuse de santé prépare du matériel",
      },
      {
        slug: "amina-student-to-teacher",
        category: "education",
        title: "D'élève à enseignante : l'histoire d'Amina",
        excerpt: "Amina faisait partie de la toute première classe que nous avons soutenue. Cette année, elle enseigne dans cette même salle — et ses élèves savent exactement qui elle est.",
        date: "30 juill. 2026",
        readTime: "5 min de lecture",
        image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Une enseignante devant sa classe",
      },
      {
        slug: "measuring-dignity",
        category: "field-notes",
        title: "Pourquoi nous mesurons la dignité, pas seulement les dollars",
        excerpt: "Les chiffres ne racontent qu'une partie de l'histoire. Notre fondatrice explique pourquoi les retours des communautés guident nos rapports autant que les tableurs.",
        date: "16 juill. 2026",
        readTime: "4 min de lecture",
        image: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=800&q=80",
        imageAlt: "Des membres de la communauté en conversation",
      },
    ] satisfies Post[],
    newsletterTitle: "Recevez ces histoires dans votre boîte",
    newsletterBody: "Des nouvelles du terrain chaque mois, sans pourriel — juste l'essentiel.",
    newsletterCta: "S'abonner à l'infolettre",
    emptyState: "Aucune histoire dans cette catégorie pour l'instant.",
  },
} as const;

export type BlogLocale = keyof typeof copy;

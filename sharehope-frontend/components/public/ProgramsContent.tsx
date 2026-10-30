"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { PublicProgram } from "@/types/program";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80";

type CategoryId = "all" | "education" | "health" | "community";

interface ProgramRow {
  id: Exclude<CategoryId, "all">;
  slug: string;
  title: string;
  description: string;
  initiatives: readonly string[];
  buttonText: string;
  image: string;
  imageAlt: string;
  rotationClass: string;
}

const ACCENTS = {
  education: { hex: "#F5B731", text: "#121212" },
  health: { hex: "#13306B", text: "#FFFFFF" },
  community: { hex: "#F05A24", text: "#FFFFFF" },
} as const;

const IMAGES = {
  education:
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
  health:
    "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80",
  community:
    "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=800&q=80",
};

const content = {
  en: {
    eyebrow: "— WHAT WE DO —",
    title: "Our Programs",
    lead: "Empowering communities through targeted, sustainable initiatives designed to break the cycle of poverty and inspire lasting change.",
    heroCaption: '"Together, we build brighter futures."',
    heroImageAlt: "Children supporting each other",
    tabs: {
      all: "ALL PROGRAMS (3)",
      education: "EDUCATION",
      health: "HEALTH & WELLNESS",
      community: "COMMUNITY DEVELOPMENT",
    },
    initiativesLabel: "Key Initiatives",
    rows: [
      {
        id: "education",
        title: "Education Access",
        description:
          "We believe that education is the most powerful catalyst for change. Our education programs focus on removing barriers to learning by providing essential school supplies, funding tuition scholarships, and building safe, modern learning centers in underserved areas.",
        initiatives: [
          "Essential School Supplies & Solar Learning Tablets Distribution",
          "Full & Partial Tuition Scholarships for Vulnerable Youth",
          "Modern Learning Center Construction & Certified Teacher Training",
        ],
        buttonText: "Learn more",
        imageAlt: "Education Access",
      },
      {
        id: "health",
        title: "Health & Wellness",
        description:
          "A healthy community is a thriving community. We partner with local healthcare providers to host mobile medical clinics, distribute nutritional support packages to families in need, and provide vital wellness and clean water education to prevent disease.",
        initiatives: [
          "Mobile Medical Clinic Operations & Maternal Emergency Care",
          "Nutritional Support Packages & Emergency Meal Programs",
          "Community Water Well Maintenance & Hygiene Workshops",
        ],
        buttonText: "Learn more",
        imageAlt: "Health & Wellness",
      },
      {
        id: "community",
        title: "Community Development",
        description:
          "Strong support systems change trajectories. We organize youth mentorship networks, vocational life-skills workshops for young adults, and family support groups to ensure that vulnerable individuals have the guidance and resources needed to become independent leaders.",
        initiatives: [
          "Youth Mentorship & Leadership Networks",
          "Vocational & Technical Life-Skills Apprenticeships",
          "Family Support, Entrepreneurship & Counseling Groups",
        ],
        buttonText: "Learn more",
        imageAlt: "Community Development",
      },
    ],
    modal: {
      badge: "100% DIRECT FIELD IMPACT",
      sponsorPrefix: "Sponsor",
      selectContribution: "Select Contribution",
      custom: "Custom",
      fullName: "Full Name",
      fullNamePlaceholder: "Jane Doe",
      email: "Email Address",
      emailPlaceholder: "jane@example.com",
      confirm: "Complete Field Sponsorship",
      securityNote: "🔒 Secure 256-bit Encryption • Tax-Deductible 501(c)(3)",
      successTitle: "Thank You for Your Support!",
      successBodyPrefix: "Your sponsorship pledge has been recorded for",
      successBodySuffix: "We will send project field logs to your email.",
      done: "Done",
    },
  },
  fr: {
    eyebrow: "— CE QUE NOUS FAISONS —",
    title: "Nos Programmes",
    lead: "Donner du pouvoir aux communautés grâce à des initiatives ciblées et durables conçues pour briser le cycle de la pauvreté et inspirer un changement durable.",
    heroCaption: "« Ensemble, nous bâtissons un avenir meilleur. »",
    heroImageAlt: "Des enfants qui s'entraident",
    tabs: {
      all: "TOUS LES PROGRAMMES (3)",
      education: "ÉDUCATION",
      health: "SANTÉ ET BIEN-ÊTRE",
      community: "DÉVELOPPEMENT COMMUNAUTAIRE",
    },
    initiativesLabel: "Principales initiatives",
    rows: [
      {
        id: "education",
        title: "Accès à l'éducation",
        description:
          "Nous croyons que l'éducation est le catalyseur le plus puissant du changement. Nos programmes éducatifs visent à éliminer les obstacles à l'apprentissage en fournissant des fournitures scolaires essentielles, en finançant des bourses d'études et en construisant des centres d'apprentissage sûrs et modernes dans les zones mal desservies.",
        initiatives: [
          "Distribution de fournitures scolaires et de tablettes solaires",
          "Bourses d'études complètes et partielles pour les jeunes vulnérables",
          "Construction de centres d'apprentissage modernes et formation d'enseignants certifiés",
        ],
        buttonText: "En savoir plus",
        imageAlt: "Accès à l'éducation",
      },
      {
        id: "health",
        title: "Santé et bien-être",
        description:
          "Une communauté en santé est une communauté florissante. Nous collaborons avec des fournisseurs de soins locaux pour organiser des cliniques médicales mobiles, distribuer des colis alimentaires aux familles dans le besoin et offrir une éducation essentielle sur le bien-être et l'eau potable afin de prévenir les maladies.",
        initiatives: [
          "Cliniques médicales mobiles et soins maternels d'urgence",
          "Colis alimentaires et programmes de repas d'urgence",
          "Entretien de puits communautaires et ateliers d'hygiène",
        ],
        buttonText: "En savoir plus",
        imageAlt: "Santé et bien-être",
      },
      {
        id: "community",
        title: "Développement communautaire",
        description:
          "Des réseaux de soutien solides changent des trajectoires. Nous organisons des réseaux de mentorat pour les jeunes, des ateliers de compétences de vie professionnelle pour les jeunes adultes et des groupes de soutien familial afin que les personnes vulnérables aient l'accompagnement et les ressources nécessaires pour devenir des leaders autonomes.",
        initiatives: [
          "Réseaux de mentorat et de leadership pour les jeunes",
          "Apprentissages professionnels et techniques",
          "Groupes de soutien familial, d'entrepreneuriat et d'accompagnement",
        ],
        buttonText: "En savoir plus",
        imageAlt: "Développement communautaire",
      },
    ],
    modal: {
      badge: "100 % D'IMPACT DIRECT SUR LE TERRAIN",
      sponsorPrefix: "Parrainer",
      selectContribution: "Choisir une contribution",
      custom: "Autre",
      fullName: "Nom complet",
      fullNamePlaceholder: "Jeanne Dupont",
      email: "Adresse courriel",
      emailPlaceholder: "jeanne@exemple.com",
      confirm: "Confirmer le parrainage",
      securityNote: "🔒 Chiffrement sécurisé 256 bits • Organisme de bienfaisance",
      successTitle: "Merci de votre soutien !",
      successBodyPrefix: "Votre promesse de parrainage a été enregistrée pour",
      successBodySuffix: "Nous vous enverrons des nouvelles du terrain par courriel.",
      done: "Terminé",
    },
  },
} as const;

export default function ProgramsContent({ locale, programs, editor }: { locale: string; programs?: PublicProgram[]; editor?: { onEditProgram: (slug: string) => void; onCreateProgram: () => void } }) {
  const t = locale === "fr" ? content.fr : content.en;

  const rows: ProgramRow[] = programs
    ? programs.filter((program) => program.category === "education" || program.category === "health" || program.category === "community").map((program, index) => ({ id: program.category as Exclude<CategoryId, "all">, slug: program.slug, title: program.title, description: program.description, initiatives: program.initiatives, buttonText: program.buttonText || (locale === "fr" ? "En savoir plus" : "Learn more"), image: program.imageUrl || IMAGES[program.category as keyof typeof IMAGES], imageAlt: program.imageAlt, rotationClass: index === 1 ? "rotate-1" : "-rotate-1" }))
    : t.rows.map((row, index) => ({ ...row, slug: row.id, image: IMAGES[row.id], rotationClass: index === 1 ? "rotate-1" : "-rotate-1" }));

  return (
    <div className="bg-brand-cream">

      {/* Hero */}
      <section className="mx-auto max-w-4xl space-y-6 px-6 pb-10 pt-12 text-center">
        <div className="space-y-3">
          <span className="font-mono-spaced block text-xs font-bold uppercase text-[#13306B]">
            {t.eyebrow}
          </span>
          <h1 className="font-serif text-4xl font-bold tracking-tight text-brand-navy sm:text-5xl md:text-6xl">
            {t.title}
          </h1>
          <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-slate-600 sm:text-lg">
            {t.lead}
          </p>
        </div>

        {/* Featured polaroid */}
        <div className="flex justify-center pb-2 pt-4">
          <div className="polaroid-frame relative w-full max-w-xl -rotate-1 rounded-sm border border-stone-200/80 bg-white p-4 pb-8">
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-sm bg-stone-100">
              <Image
                src={HERO_IMAGE}
                alt={t.heroImageAlt}
                fill
                priority
                sizes="(min-width: 768px) 576px, 100vw"
                className="object-cover"
              />
            </div>
            <p className="font-handwriting mt-3 text-center text-xl font-bold text-slate-700">
              {t.heroCaption}
            </p>
          </div>
        </div>

      </section>

      {/* Program rows */}
      <div className="mx-auto w-full max-w-6xl flex-1 space-y-20 px-6 py-8">
        {rows.length === 0 && <p className="py-16 text-center text-slate-600">{locale === "fr" ? "Aucun programme publié." : "No published programs."}</p>}
        {rows.map((row, index) => {
          const imageFirst = index % 2 === 0;
          const accent = ACCENTS[row.id];
          return (
            <section
              key={row.slug}
              className="grid grid-cols-1 items-center gap-10 border-t border-[#E5E0D8]/60 pt-16 transition-all duration-300 lg:grid-cols-12"
            >
              {/* Polaroid image */}
              <div
                className={`flex justify-center lg:col-span-5 ${
                  imageFirst ? "" : "order-1 lg:order-2"
                }`}
              >
                <div
                  className={`polaroid-frame relative w-full max-w-md rounded-sm border border-stone-200/80 bg-white p-4 ${row.rotationClass}`}
                >
                  <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone-100">
                    <Image
                      src={row.image}
                      alt={row.imageAlt}
                      fill
                      sizes="(min-width: 1024px) 448px, 100vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div
                className={`space-y-5 lg:col-span-7 ${
                  imageFirst ? "" : "order-2 lg:order-1"
                }`}
              >
                <h2 className="font-serif text-3xl font-bold text-brand-navy sm:text-4xl">
                  {row.title}
                </h2>
                <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
                  {row.description}
                </p>

                <div className="space-y-2 border-t border-stone-200/80 pt-1">
                  <p className="font-mono-spaced text-xs font-bold uppercase text-slate-500">
                    {t.initiativesLabel}
                  </p>
                  <ul className="space-y-2 text-xs font-medium text-slate-700 sm:text-sm">
                    {row.initiatives.map((initiative) => (
                      <li key={initiative} className="flex items-start gap-2.5">
                        <span className="text-sm font-bold" style={{ color: accent.hex }}>✓</span>
                        <span>{initiative}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <Link
                    href={`/${row.id}`}
                    data-visual-editor-lock
                    onClick={(clickEvent) => { if (editor) { clickEvent.preventDefault(); editor.onEditProgram(row.slug); } }}
                    className="font-mono-spaced inline-flex w-full items-center justify-center gap-2 rounded-lg px-6 py-3.5 text-xs font-bold uppercase shadow-sm transition-all hover:-translate-y-0.5 hover:brightness-95 sm:w-auto"
                    style={{ backgroundColor: accent.hex, color: accent.text }}
                  >
                    <span>{editor ? "Edit program" : row.buttonText}</span>
                    <span>→</span>
                  </Link>
                </div>
              </div>
            </section>
          );
        })}
        {editor && <div className="border-t border-[#E5E0D8] pt-12 text-center"><button type="button" onClick={editor.onCreateProgram} className="font-mono-spaced rounded-lg bg-brand-navy px-6 py-4 text-xs font-bold uppercase tracking-widest text-white">Add a program</button></div>}
      </div>

    </div>
  );
}

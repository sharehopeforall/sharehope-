import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Building2, Globe2, HeartHandshake, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getManagedPage } from "@/lib/server/site-page";

const content = {
  en: {
    eyebrow: "PARTNER WITH SHAREHOPE", title: "Build lasting change, together.", intro: "We collaborate with companies, foundations, community groups, and institutions that want to turn shared values into measurable impact.", primary: "Start a partnership",
    heroImageAlt: "Children holding the school supplies they received from ShareHope",
    whyEyebrow: "WHY PARTNER WITH US", whyTitle: "A partnership designed around real outcomes.", whyBody: "Your organization brings unique resources, expertise, and reach. ShareHope connects those strengths with locally informed programs in education, health, and family support.",
    typesTitle: "Ways to partner", types: [
      ["Corporate partnerships", "Align your company’s purpose, employees, and resources with a program or community initiative.", Building2],
      ["Foundation support", "Fund defined outcomes through grants, multi-year commitments, or strategic program investment.", Globe2],
      ["Employee engagement", "Create meaningful volunteer, fundraising, and skills-based opportunities for your team.", Users],
      ["Community collaboration", "Co-create events, campaigns, and local initiatives with schools, associations, and civic groups.", HeartHandshake],
    ],
    bandEyebrow: "SHARED IMPACT", bandTitle: "Clear goals. Visible progress.", bandBody: "Every partnership is built around a shared plan, so you always know what your support makes possible.", bandImageAlt: "A smiling girl holding a new school backpack",
    processTitle: "How partnership works", process: [["01", "Discover", "We learn about your goals, audience, resources, and preferred involvement."], ["02", "Design", "Together, we shape a clear plan with responsibilities, milestones, and outcomes."], ["03", "Deliver", "We launch the work, share progress, and keep your team connected to the impact."], ["04", "Measure", "You receive practical reporting, stories, and next-step recommendations."]],
    ctaEyebrow: "LET’S START A CONVERSATION", ctaTitle: "What could we accomplish together?", ctaBody: "Tell us what your organization cares about. Our team will help identify the partnership model that makes the most sense.", ctaButton: "Contact our partnerships team", ctaNote: "No commitment required. We’ll begin with a short discovery conversation.",
  },
  fr: {
    eyebrow: "DEVENIR PARTENAIRE DE SHAREHOPE", title: "Créons un changement durable, ensemble.", intro: "Nous collaborons avec des entreprises, fondations, groupes communautaires et institutions qui souhaitent transformer des valeurs communes en impact mesurable.", primary: "Démarrer un partenariat",
    heroImageAlt: "Des enfants tenant les fournitures scolaires reçues de ShareHope",
    whyEyebrow: "POURQUOI NOUS CHOISIR", whyTitle: "Un partenariat axé sur des résultats concrets.", whyBody: "Votre organisation apporte des ressources, une expertise et une portée uniques. ShareHope relie ces forces à des programmes locaux en éducation, santé et soutien familial.",
    typesTitle: "Façons de collaborer", types: [
      ["Partenariats d’entreprise", "Associez la mission, les employés et les ressources de votre entreprise à un programme communautaire.", Building2],
      ["Soutien des fondations", "Financez des résultats précis grâce à des subventions ou à des engagements pluriannuels.", Globe2],
      ["Mobilisation des employés", "Créez des occasions de bénévolat, de collecte de fonds et de partage de compétences.", Users],
      ["Collaboration communautaire", "Cocréez des événements et initiatives avec des écoles, associations et groupes civiques.", HeartHandshake],
    ],
    bandEyebrow: "IMPACT PARTAGÉ", bandTitle: "Des objectifs clairs. Des progrès visibles.", bandBody: "Chaque partenariat repose sur un plan commun, pour que vous sachiez toujours ce que votre soutien rend possible.", bandImageAlt: "Une fillette souriante tenant un nouveau sac d'école",
    processTitle: "Notre approche", process: [["01", "Découvrir", "Nous explorons vos objectifs, votre public, vos ressources et votre engagement."], ["02", "Concevoir", "Nous créons ensemble un plan clair avec responsabilités, étapes et résultats."], ["03", "Réaliser", "Nous lançons le projet, partageons les progrès et gardons votre équipe engagée."], ["04", "Mesurer", "Vous recevez des rapports pratiques, des témoignages et des recommandations."]],
    ctaEyebrow: "COMMENÇONS LA CONVERSATION", ctaTitle: "Que pourrions-nous accomplir ensemble?", ctaBody: "Parlez-nous des priorités de votre organisation. Notre équipe vous proposera le modèle de partenariat le plus pertinent.", ctaButton: "Contacter notre équipe", ctaNote: "Aucun engagement requis. Nous commencerons par une courte conversation exploratoire.",
  },
} as const;

const eyebrowClass = "text-xs font-bold uppercase tracking-[.2em] text-[#13306B]/70";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = locale === "fr" ? content.fr : content.en; const managed = await getManagedPage("partner", locale);
  return { title: typeof managed?.settings.metaTitle === "string" && managed.settings.metaTitle ? managed.settings.metaTitle : `${locale === "fr" ? "Devenir partenaire" : "Partner With Us"} | ShareHope`, description: typeof managed?.settings.metaDescription === "string" && managed.settings.metaDescription ? managed.settings.metaDescription : managed?.body || t.intro };
}

export default async function PartnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const base = locale === "fr" ? content.fr : content.en; const managed = await getManagedPage("partner", locale); const t = { ...base, title: managed?.title || base.title, eyebrow: managed?.subtitle || base.eyebrow, intro: managed?.body || base.intro, primary: managed?.buttonText || base.primary };

  return (
    <main className="bg-white text-slate-800">
      {/* Hero */}
      <section className="grid bg-brand-cream lg:min-h-[620px] lg:grid-cols-2">
        <div className="flex items-center px-6 py-16 sm:px-10 lg:px-16 lg:py-20 xl:pl-24">
          <div className="max-w-[580px]">
            <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-navy sm:text-sm">{t.eyebrow}</p>
            <h1 className="mt-5 text-balance font-serif text-[3rem] font-normal leading-[1.08] tracking-[-0.01em] text-brand-navy sm:text-[3.5rem] xl:text-[4.25rem]">{t.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-slate-700 md:text-xl">{t.intro}</p>
            <Link href="/partner/form" className="mt-10 inline-flex items-center rounded-sm bg-brand-navy px-8 py-4 text-sm font-bold uppercase tracking-[.14em] text-white transition hover:bg-[#13306B]">{t.primary}</Link>
          </div>
        </div>
        <div className="relative min-h-[380px] sm:min-h-[460px] lg:min-h-0">
          <Image src="/images/education-hero-group.png" alt={t.heroImageAlt} fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover object-[72%_center]" data-visual-key="partner-hero-image" />
        </div>
      </section>

      {/* Why partner: one strong statement */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-4xl text-center">
          <p className={eyebrowClass}>{t.whyEyebrow}</p>
          <h2 className="mt-5 text-balance font-serif text-4xl font-bold leading-tight text-brand-navy md:text-5xl">{t.whyTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">{t.whyBody}</p>
        </div>
      </section>

      {/* Ways to partner: editorial list, no boxes */}
      <section className="px-6 pb-20 lg:pb-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-3xl font-bold text-brand-navy md:text-4xl">{t.typesTitle}</h2>
          <ul className="mt-10 grid gap-x-16 md:grid-cols-2">
            {t.types.map(([title, body, Icon], i) => (
              <li key={title} className="flex gap-6 border-t border-slate-200 py-8">
                <span className="font-serif text-sm font-semibold text-[#13306B]/50">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <Icon className="size-6 text-[#13306B]" aria-hidden="true" />
                    <h3 className="font-serif text-2xl font-semibold text-brand-navy">{title}</h3>
                  </div>
                  <p className="mt-3 leading-relaxed text-slate-600">{body}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Photo band */}
      <section className="relative isolate overflow-hidden bg-[#EDE6DA]">
        <Image src="/images/sharehope-cover.png" alt={t.bandImageAlt} fill sizes="100vw" className="-z-20 object-cover object-[80%_center]" data-visual-key="partner-band-image" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#EDE6DA] via-[#EDE6DA]/80 to-transparent" />
        <div className="mx-auto flex min-h-[440px] max-w-7xl items-center px-6 py-20">
          <div className="max-w-lg">
            <p className={eyebrowClass}>{t.bandEyebrow}</p>
            <h2 className="mt-5 text-balance font-serif text-4xl font-bold leading-tight text-brand-navy md:text-5xl">{t.bandTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-slate-700">{t.bandBody}</p>
          </div>
        </div>
      </section>

      {/* Process: connected timeline */}
      <section className="px-6 py-20 lg:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-center font-serif text-3xl font-bold text-brand-navy md:text-4xl">{t.processTitle}</h2>
          <ol className="relative mt-14 grid gap-12 md:grid-cols-4 md:gap-8">
            <span aria-hidden="true" className="absolute left-[12.5%] right-[12.5%] top-6 hidden h-px bg-slate-300 md:block" />
            {t.process.map(([number, title, body]) => (
              <li key={number} className="relative text-center">
                <span className="relative mx-auto flex size-12 items-center justify-center rounded-full bg-brand-navy font-serif text-sm font-semibold text-white ring-8 ring-white">{number}</span>
                <h3 className="mt-6 font-serif text-2xl font-semibold text-brand-navy">{title}</h3>
                <p className="mx-auto mt-3 max-w-xs text-sm leading-relaxed text-slate-600">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-brand-navy px-6 py-20 text-white lg:py-24">
        <div className="mx-auto flex max-w-6xl flex-col gap-10 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[.2em] text-white/60">{t.ctaEyebrow}</p>
            <h2 className="mt-4 text-balance font-serif text-4xl font-bold leading-tight md:text-5xl">{t.ctaTitle}</h2>
            <p className="mt-5 text-lg leading-relaxed text-white/75">{t.ctaBody}</p>
          </div>
          <div className="shrink-0">
            <Link href="/partner/form" className="inline-flex items-center gap-2 rounded-md bg-white px-7 py-4 text-sm font-bold uppercase tracking-[.1em] text-brand-navy transition hover:bg-[#E6EEFB]">
              {t.ctaButton}<ArrowRight className="size-4" />
            </Link>
            <p className="mt-4 max-w-xs text-sm text-white/60">{t.ctaNote}</p>
          </div>
        </div>
      </section>
    </main>
  );
}

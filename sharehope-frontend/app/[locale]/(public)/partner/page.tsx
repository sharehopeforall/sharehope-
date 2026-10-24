import type { Metadata } from "next";
import Image from "next/image";
import { ArrowRight, Building2, Globe2, Handshake, HeartHandshake, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getManagedPage } from "@/lib/server/site-page";

const content = {
  en: {
    eyebrow: "PARTNER WITH SHAREHOPE", title: "Build lasting change, together.", intro: "We collaborate with companies, foundations, community groups, and institutions that want to turn shared values into measurable impact.", primary: "Start a partnership",
    whyEyebrow: "WHY PARTNER WITH US", whyTitle: "A partnership designed around real outcomes.", whyBody: "Your organization brings unique resources, expertise, and reach. ShareHope connects those strengths with locally informed programs in education, health, clean water, and family support.",
    typesTitle: "Ways to partner", types: [
      ["Corporate partnerships", "Align your company’s purpose, employees, and resources with a program or community initiative.", Building2],
      ["Foundation support", "Fund defined outcomes through grants, multi-year commitments, or strategic program investment.", Globe2],
      ["Employee engagement", "Create meaningful volunteer, fundraising, and skills-based opportunities for your team.", Users],
      ["Community collaboration", "Co-create events, campaigns, and local initiatives with schools, associations, and civic groups.", HeartHandshake],
    ],
    processTitle: "How partnership works", process: [["01", "Discover", "We learn about your goals, audience, resources, and preferred involvement."], ["02", "Design", "Together, we shape a clear plan with responsibilities, milestones, and outcomes."], ["03", "Deliver", "We launch the work, share progress, and keep your team connected to the impact."], ["04", "Measure", "You receive practical reporting, stories, and next-step recommendations."]],
    ctaEyebrow: "LET’S START A CONVERSATION", ctaTitle: "What could we accomplish together?", ctaBody: "Tell us what your organization cares about. Our team will help identify the partnership model that makes the most sense.", ctaButton: "Contact our partnerships team", ctaNote: "No commitment required. We’ll begin with a short discovery conversation.",
  },
  fr: {
    eyebrow: "DEVENIR PARTENAIRE DE SHAREHOPE", title: "Créons un changement durable, ensemble.", intro: "Nous collaborons avec des entreprises, fondations, groupes communautaires et institutions qui souhaitent transformer des valeurs communes en impact mesurable.", primary: "Démarrer un partenariat",
    whyEyebrow: "POURQUOI NOUS CHOISIR", whyTitle: "Un partenariat axé sur des résultats concrets.", whyBody: "Votre organisation apporte des ressources, une expertise et une portée uniques. ShareHope relie ces forces à des programmes locaux en éducation, santé, eau potable et soutien familial.",
    typesTitle: "Façons de collaborer", types: [
      ["Partenariats d’entreprise", "Associez la mission, les employés et les ressources de votre entreprise à un programme communautaire.", Building2],
      ["Soutien des fondations", "Financez des résultats précis grâce à des subventions ou à des engagements pluriannuels.", Globe2],
      ["Mobilisation des employés", "Créez des occasions de bénévolat, de collecte de fonds et de partage de compétences.", Users],
      ["Collaboration communautaire", "Cocréez des événements et initiatives avec des écoles, associations et groupes civiques.", HeartHandshake],
    ],
    processTitle: "Notre approche", process: [["01", "Découvrir", "Nous explorons vos objectifs, votre public, vos ressources et votre engagement."], ["02", "Concevoir", "Nous créons ensemble un plan clair avec responsabilités, étapes et résultats."], ["03", "Réaliser", "Nous lançons le projet, partageons les progrès et gardons votre équipe engagée."], ["04", "Mesurer", "Vous recevez des rapports pratiques, des témoignages et des recommandations."]],
    ctaEyebrow: "COMMENÇONS LA CONVERSATION", ctaTitle: "Que pourrions-nous accomplir ensemble?", ctaBody: "Parlez-nous des priorités de votre organisation. Notre équipe vous proposera le modèle de partenariat le plus pertinent.", ctaButton: "Contacter notre équipe", ctaNote: "Aucun engagement requis. Nous commencerons par une courte conversation exploratoire.",
  },
} as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; const t = locale === "fr" ? content.fr : content.en; const managed = await getManagedPage("partner", locale);
  return { title: typeof managed?.settings.metaTitle === "string" && managed.settings.metaTitle ? managed.settings.metaTitle : `${locale === "fr" ? "Devenir partenaire" : "Partner With Us"} | ShareHope`, description: typeof managed?.settings.metaDescription === "string" && managed.settings.metaDescription ? managed.settings.metaDescription : managed?.body || t.intro };
}

export default async function PartnerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params; const base = locale === "fr" ? content.fr : content.en; const managed = await getManagedPage("partner", locale); const t = { ...base, title: managed?.title || base.title, eyebrow: managed?.subtitle || base.eyebrow, intro: managed?.body || base.intro, primary: managed?.buttonText || base.primary };
  return <main className="bg-white text-slate-800">
    <section className="relative overflow-hidden bg-brand-cream">
      <div className="mx-auto grid max-w-[1440px] lg:min-h-[680px] lg:grid-cols-[1.08fr_.92fr]">
        <div className="relative z-10 flex items-center px-6 py-16 sm:px-10 lg:px-14 lg:py-20 xl:pl-24 xl:pr-16">
          <div className="max-w-[640px]">
            <div className="inline-flex items-center gap-3 rounded-full border border-brand-navy/15 bg-white/70 px-4 py-2"><Handshake className="size-4 text-brand-green" /><p className="text-[11px] font-bold uppercase tracking-[.2em] text-brand-navy">{t.eyebrow}</p></div>
            <h1 className="mt-7 text-pretty font-serif text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.025em] text-brand-navy sm:text-[3.4rem] xl:text-[4rem]">{t.title}</h1>
            <p className="mt-6 max-w-[590px] text-[1.05rem] leading-[1.7] text-slate-600 md:text-lg">{t.intro}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4"><Link href="/contact?topic=partnership" className="inline-flex items-center gap-2 rounded-sm bg-[#FFC72C] px-7 py-4 text-sm font-black uppercase tracking-[.1em] text-brand-navy shadow-sm transition hover:-translate-y-0.5 hover:bg-[#E2AD17] hover:shadow-lg">{t.primary}<ArrowRight className="size-4" /></Link><Link href="/programs" className="inline-flex items-center border-b-2 border-brand-navy pb-1 text-sm font-bold text-brand-navy transition hover:border-brand-green hover:text-brand-green">{locale === "fr" ? "Découvrir nos programmes" : "Explore our programs"}</Link></div>
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-brand-navy/15 pt-6 text-xs font-bold uppercase tracking-wider text-slate-600"><span>Corporate</span><span>Foundations</span><span>{locale === "fr" ? "Communautés" : "Communities"}</span></div>
          </div>
        </div>
        <div className="relative min-h-[480px] overflow-hidden bg-brand-navy lg:min-h-0">
          <div className="absolute -left-24 -top-24 size-72 rounded-full bg-brand-green/30 blur-3xl" /><div className="absolute -bottom-28 right-0 size-80 rounded-full bg-[#FFC72C]/25 blur-3xl" />
          <div className="absolute inset-5 flex items-center justify-center sm:inset-10 lg:inset-12"><div className="relative aspect-square w-full max-w-[620px] overflow-hidden rounded-[2rem] bg-[#F7F2E9] shadow-2xl"><Image src="/images/sharehope-hero-collage.png" alt={locale === "fr" ? "Enfants et initiatives communautaires soutenus par ShareHope" : "Children and community initiatives supported by ShareHope"} fill priority className="object-cover" sizes="(min-width: 1024px) 52vw, 100vw" /></div></div>
          <div className="absolute bottom-7 left-7 right-7 rounded-xl border border-white/20 bg-brand-navy/90 p-4 text-white shadow-xl backdrop-blur md:left-auto md:right-8 md:max-w-xs"><p className="text-xs font-bold uppercase tracking-[.16em] text-[#FFC72C]">{locale === "fr" ? "Impact partagé" : "Shared impact"}</p><p className="mt-2 font-serif text-xl font-bold">{locale === "fr" ? "Des objectifs clairs. Des progrès visibles." : "Clear goals. Visible progress."}</p></div>
        </div>
      </div>
    </section>
    <section className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[.8fr_1.2fr] lg:py-28"><div><p className="font-space-mono text-xs font-bold tracking-[.2em] text-brand-green">{t.whyEyebrow}</p><h2 className="mt-4 font-serif text-4xl font-bold leading-tight text-brand-navy md:text-5xl">{t.whyTitle}</h2><p className="mt-6 text-lg leading-relaxed text-slate-600">{t.whyBody}</p></div><div><h2 className="font-serif text-3xl font-bold text-brand-navy">{t.typesTitle}</h2><div className="mt-7 grid gap-px overflow-hidden border border-slate-200 bg-slate-200 sm:grid-cols-2">{t.types.map(([title, body, Icon]) => <article key={title} className="bg-white p-7"><Icon className="size-8 text-brand-green" /><h3 className="mt-5 font-serif text-2xl font-bold text-brand-navy">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p></article>)}</div></div></section>
    <section className="bg-[#F7F2E9] px-6 py-20 lg:py-24"><div className="mx-auto max-w-7xl"><div className="flex items-center gap-3"><Handshake className="size-8 text-brand-green" /><h2 className="font-serif text-4xl font-bold text-brand-navy">{t.processTitle}</h2></div><div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">{t.process.map(([number, title, body]) => <article key={number} className="border-t-4 border-brand-navy bg-white p-6"><span className="font-space-mono text-sm font-bold text-brand-green">{number}</span><h3 className="mt-4 font-serif text-2xl font-bold text-brand-navy">{title}</h3><p className="mt-3 text-sm leading-relaxed text-slate-600">{body}</p></article>)}</div></div></section>
    <section className="px-6 py-20 lg:py-28"><div className="mx-auto max-w-5xl overflow-hidden rounded-3xl bg-brand-navy px-7 py-12 text-center text-white md:px-16 md:py-16"><p className="font-space-mono text-xs font-bold tracking-[.2em] text-[#FFC72C]">{t.ctaEyebrow}</p><h2 className="mx-auto mt-4 max-w-3xl font-serif text-4xl font-bold md:text-5xl">{t.ctaTitle}</h2><p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-slate-200">{t.ctaBody}</p><Link href="/contact?topic=partnership" className="mt-8 inline-flex items-center gap-2 bg-[#FFC72C] px-7 py-4 font-bold text-brand-navy transition hover:bg-white">{t.ctaButton}<ArrowRight className="size-4" /></Link><p className="mt-4 text-xs text-slate-300">{t.ctaNote}</p></div></section>
  </main>;
}

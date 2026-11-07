import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ManagedPageContent } from "@/lib/server/site-page";

const copy = {
  en: {
    eyebrow: "Our story",
    title: "It started with a promise.",
    lead: "Before ShareHope had a name, it was a promise a young girl made to herself: that no child, no expectant mother, no one would go through what she went through.",
    heroImageAlt: "A community gathering at sunset",
    chapters: [
      {
        label: "Chapter One",
        title: "The promise",
        body: "Our founder was raised by her grandmother, who sometimes pawned her wraps and jewelry so they could eat. On the hardest days, there was only a glass of water. After her father passed away, she spent three years out of school. In those years she made a promise: she would do everything she could so that no one would live what she lived. That promise became ShareHope.",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Students in a classroom raising their hands",
      },
      {
        label: "Chapter Two",
        title: "Where it began",
        body: "In 2022, it started as People's Care Center. We shared school supplies and food with children in need, and placed some in apprenticeships such as sewing. Then we thought of families who cannot provide three meals a day, and began distributing food at Christmas. We visit sick children in hospital with gifts and prayer, and we help single mothers start a small trade to provide for their children. And the list continues.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Hands joined together in a circle",
      },
      {
        label: "Chapter Three",
        title: "Where we're going",
        body: "The families we serve tell us they found hope again, because someone cares about them. Their words move us to tears, and they challenge us to do more. We have learned that there is more joy in giving than in receiving, and that we must empty our hands to receive new blessings. We cannot do this alone. The next chapter needs you.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Children walking together on a road",
      },
    ],
    quote: "If we wait until we have more than enough to give, we will never give.",
    quoteAttribution: "Marie L., Founder",
    ctaTitle: "Every story needs new voices.",
    ctaBody: "Join us — as a donor, volunteer, or partner — and help write what comes next.",
    ctaPrimary: "Get involved",
    ctaSecondary: "Meet the founder",
  },
  fr: {
    eyebrow: "Notre histoire",
    title: "Tout a commencé par une promesse.",
    lead: "Avant même que ShareHope porte un nom, c'était une promesse qu'une petite fille s'était faite : qu'aucun enfant, aucune femme enceinte, personne ne traverse ce qu'elle a traversé.",
    heroImageAlt: "Un rassemblement communautaire au coucher du soleil",
    chapters: [
      {
        label: "Chapitre un",
        title: "La promesse",
        body: "Notre fondatrice a été élevée par sa grand-mère, qui mettait parfois ses pagnes et ses bijoux en gage pour qu'elles puissent manger. Les jours les plus durs, il n'y avait qu'un verre d'eau. Après le décès de son père, elle est restée trois ans sans aller à l'école. Pendant ces années, elle s'est fait une promesse : tout faire pour que personne ne vive ce qu'elle a vécu. Cette promesse est devenue ShareHope.",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des élèves lèvent la main dans une salle de classe",
      },
      {
        label: "Chapitre deux",
        title: "Les premiers pas",
        body: "En 2022, tout a commencé sous le nom de People's Care Center. Nous avons partagé des fournitures scolaires et des vivres avec des enfants démunis, et placé certains en apprentissage, comme la couture. Puis nous avons pensé aux familles qui ne peuvent pas assurer trois repas par jour, et avons commencé à distribuer des vivres à Noël. Nous rendons visite aux enfants malades à l'hôpital avec des cadeaux et la prière, et nous aidons des mères célibataires à lancer un petit commerce pour subvenir aux besoins de leurs enfants. Et la liste continue.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des mains jointes formant un cercle",
      },
      {
        label: "Chapitre trois",
        title: "La suite",
        body: "Les familles que nous servons nous disent avoir retrouvé l'espoir, parce que quelqu'un se soucie d'elles. Leurs mots nous émeuvent aux larmes et nous défient de faire plus. Nous avons appris qu'il y a plus de joie à donner qu'à recevoir, et qu'il faut vider nos mains pour recevoir de nouvelles bénédictions. Nous ne pouvons pas le faire seuls. Le prochain chapitre a besoin de vous.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des enfants marchent ensemble sur un chemin",
      },
    ],
    quote: "S'il faut attendre le superflu pour donner, on ne donnera jamais.",
    quoteAttribution: "Marie L., fondatrice",
    ctaTitle: "Chaque histoire a besoin de nouvelles voix.",
    ctaBody: "Rejoignez-nous — comme donateur, bénévole ou partenaire — et aidez à écrire la suite.",
    ctaPrimary: "S'impliquer",
    ctaSecondary: "Rencontrer la fondatrice",
  },
} as const;

export default function OurStoryContent({ locale, managed }: { locale: string; managed?: ManagedPageContent | null }) {
  const base = locale === "fr" ? copy.fr : copy.en;
  const t = { ...base, title: managed?.title || base.title, eyebrow: managed?.subtitle || base.eyebrow, lead: managed?.body || base.lead, ctaPrimary: managed?.buttonText || base.ctaPrimary };

  return (
    <div className="bg-brand-cream text-[#121212]">
      {/* Hero — centered editorial */}
      <section className="mx-auto max-w-3xl px-6 pb-12 pt-20 text-center sm:pt-28">
        <p className="font-mono-spaced text-xs font-bold uppercase text-[#13306B]">{t.eyebrow}</p>
        <h1 className="font-serif mt-6 text-4xl font-bold leading-[1.1] text-brand-navy sm:text-5xl lg:text-6xl">
          {t.title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">{t.lead}</p>
      </section>

      {/* Full-width hero image */}
      <div className="relative mx-auto aspect-[21/9] max-w-6xl overflow-hidden rounded-2xl shadow-xl sm:mx-6 lg:mx-auto">
        <Image
          src="https://images.unsplash.com/photo-1542810634-71277d95dcbb?auto=format&fit=crop&w=1800&q=80"
          alt={t.heroImageAlt}
          fill
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover object-[center_38%]"
        />
      </div>

      {/* Chapters — alternating editorial rows */}
      <div className="mx-auto max-w-5xl space-y-24 px-6 py-24">
        {t.chapters.map((chapter, i) => (
          <section key={chapter.title} className="grid items-center gap-10 lg:grid-cols-2">
            <div className={`relative aspect-[4/3] overflow-hidden rounded-xl shadow-lg ${i % 2 === 1 ? "lg:order-2" : ""}`}>
              <Image
                src={chapter.image}
                alt={chapter.imageAlt}
                fill
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className={i % 2 === 1 ? "lg:order-1" : ""}>
              <p className="font-mono-spaced text-xs font-bold uppercase text-[#F05A24]">{chapter.label}</p>
              <h2 className="font-serif mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{chapter.title}</h2>
              <p className="mt-5 text-base leading-[1.8] text-slate-700">{chapter.body}</p>
            </div>
          </section>
        ))}
      </div>

      {/* Pull quote */}
      <section className="border-y border-[#E5E0D8] bg-white px-6 py-20">
        <figure className="mx-auto max-w-3xl text-center">
          <span className="font-serif text-7xl leading-none text-[#FFC72C]">“</span>
          <blockquote className="font-serif -mt-5 text-2xl font-medium leading-relaxed text-brand-navy sm:text-3xl">
            {t.quote}
          </blockquote>
          <figcaption className="font-mono-spaced mt-6 text-xs font-bold uppercase text-slate-500">
            {t.quoteAttribution}
          </figcaption>
        </figure>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 text-center">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="font-serif text-3xl font-bold text-brand-navy sm:text-4xl">{t.ctaTitle}</h2>
          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">{t.ctaBody}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/get-involved"
              className="font-mono-spaced inline-flex items-center rounded-lg bg-[#FFC72C] px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#121212] shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#E2AD17]"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/about/founder"
              className="font-mono-spaced inline-flex items-center rounded-lg border-2 border-brand-navy px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-navy transition-all hover:-translate-y-0.5 hover:bg-brand-navy hover:text-white"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

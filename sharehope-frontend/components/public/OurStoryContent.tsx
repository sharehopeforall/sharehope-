import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ManagedPageContent } from "@/lib/server/site-page";

const copy = {
  en: {
    eyebrow: "Our story",
    title: "It started with a single classroom.",
    lead: "Before ShareHope had a name, it was a promise made to thirty students and one teacher who refused to give up on them.",
    heroImageAlt: "A community gathering at sunset",
    chapters: [
      {
        label: "Chapter One",
        title: "The promise",
        body: "In 2016, a volunteer trip turned into something more. A school principal showed our founder a classroom with forty students sharing twelve textbooks — and a waiting list of children who wanted nothing more than a seat. The first fundraiser raised enough for supplies, uniforms, and a year's worth of hope. Nobody planned to keep going. Everybody did.",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Students in a classroom raising their hands",
      },
      {
        label: "Chapter Two",
        title: "Listening first",
        body: "The early years taught us the most important lesson: communities don't need rescuing — they need resources and respect. We stopped arriving with answers and started arriving with questions. Every program since has been designed by the people it serves, from mobile health clinics to mentorship networks.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Hands joined together in a circle",
      },
      {
        label: "Chapter Three",
        title: "Where we're going",
        body: "Today, ShareHope works across twelve countries — but the model stays small and local on purpose. One community at a time, one promise at a time. The next chapter is the same as the first: show up, listen, and stay as long as it takes.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Children walking together on a road",
      },
    ],
    quote: "We don't measure success by what we build. We measure it by what communities build after we leave.",
    quoteAttribution: "Marie L., Founder",
    ctaTitle: "Every story needs new voices.",
    ctaBody: "Join us — as a donor, volunteer, or partner — and help write what comes next.",
    ctaPrimary: "Get involved",
    ctaSecondary: "Meet the founder",
  },
  fr: {
    eyebrow: "Notre histoire",
    title: "Tout a commencé dans une seule salle de classe.",
    lead: "Avant même que ShareHope porte un nom, c'était une promesse faite à trente élèves et à un enseignant qui refusait d'abandonner.",
    heroImageAlt: "Un rassemblement communautaire au coucher du soleil",
    chapters: [
      {
        label: "Chapitre un",
        title: "La promesse",
        body: "En 2016, un voyage de bénévolat est devenu quelque chose de plus grand. Une directrice d'école a montré à notre fondatrice une classe où quarante élèves partageaient douze manuels — et une liste d'attente d'enfants qui ne demandaient qu'une place. La première collecte a financé des fournitures, des uniformes et une année d'espoir. Personne n'avait prévu de continuer. Tout le monde l'a fait.",
        image: "https://images.unsplash.com/photo-1497486751825-1233686d5d80?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des élèves lèvent la main dans une salle de classe",
      },
      {
        label: "Chapitre deux",
        title: "Écouter d'abord",
        body: "Les premières années nous ont enseigné la leçon la plus importante : les communautés n'ont pas besoin d'être sauvées — elles ont besoin de ressources et de respect. Nous avons cessé d'arriver avec des réponses pour arriver avec des questions. Depuis, chaque programme est conçu par les personnes qu'il sert, des cliniques mobiles aux réseaux de mentorat.",
        image: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des mains jointes formant un cercle",
      },
      {
        label: "Chapitre trois",
        title: "La suite",
        body: "Aujourd'hui, ShareHope agit dans douze pays — mais le modèle reste volontairement local et à taille humaine. Une communauté à la fois, une promesse à la fois. Le prochain chapitre ressemble au premier : se présenter, écouter, et rester aussi longtemps qu'il le faut.",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80",
        imageAlt: "Des enfants marchent ensemble sur un chemin",
      },
    ],
    quote: "Nous ne mesurons pas le succès par ce que nous construisons. Nous le mesurons par ce que les communautés bâtissent après notre départ.",
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

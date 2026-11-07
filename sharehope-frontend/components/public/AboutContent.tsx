import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ManagedPageContent } from "@/lib/server/site-page";

const copy = {
  en: {
    heroEyebrow: "Our story",
    heroTitle: "Hope is a team effort.",
    heroLead: "ShareHope is a non-profit organization born from our founder's own childhood of hardship. We share the little we have to bring a smile to children in need, orphans, widows, single mothers, and the sick.",
    missionEyebrow: "Our mission",
    missionStatement: "To walk alongside communities as they build the futures they imagine — with dignity, partnership, and lasting support.",
    timelineEyebrow: "How we got here",
    timelineTitle: "A few milestones along the way",
    timeline: [
      { year: "2022", title: "Where it began", body: "It started as People's Care Center, helping children in need with school supplies and food, and placing some in apprenticeships such as sewing." },
      { year: "2023", title: "Growing", body: "We began visiting sick children in hospital, praying for them and bringing food to their families." },
      { year: "2026", title: "A new name: ShareHope", body: "People's Care Center became ShareHope, carrying the same promise forward. And the list continues." },
    ],
    valuesEyebrow: "What guides us",
    valuesTitle: "Our values",
    values: [
      { title: "Give now", body: "If we wait until we have more than enough to give, we will never give." },
      { title: "Be the solution", body: "We look for where the needs are, and work to meet them." },
      { title: "Little goes far", body: "The little we have can do much more than we think." },
      { title: "Together", body: "It is a noble but great task. We all need to lend a hand to help our neighbors." },
    ],
    teamEyebrow: "The people behind it",
    teamTitle: "Meet the team",
    teamLead: "A small team, powered by hundreds of volunteers and local partners.",
    team: [
      { name: "Marie L.", role: "Founder & Director", bio: "Founded ShareHope from a childhood promise that no one should live the hardship she knew.", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
      { name: "Kwame A.", role: "Programs Lead", bio: "Turns community ideas into programs that last.", photo: "" },
      { name: "Sofia R.", role: "Community Partnerships", bio: "Builds bridges between local leaders and supporters.", photo: "" },
      { name: "Daniel T.", role: "Operations", bio: "Keeps every dollar accountable and every project on track.", photo: "" },
    ],
    ctaTitle: "Be part of the story.",
    ctaBody: "Whether you give, volunteer, or partner with us — there's a place for you here.",
    ctaPrimary: "Donate",
    ctaSecondary: "Volunteer",
  },
  fr: {
    heroEyebrow: "Notre histoire",
    heroTitle: "L'espoir est un travail d'équipe.",
    heroLead: "ShareHope est une organisation à but non lucratif, née de l'enfance difficile de notre fondatrice. Nous partageons le peu que nous avons pour mettre le sourire aux lèvres des enfants démunis, des orphelins, des veuves, des mères célibataires et des malades.",
    missionEyebrow: "Notre mission",
    missionStatement: "Accompagner les communautés dans la construction de l'avenir qu'elles imaginent — avec dignité, partenariat et soutien durable.",
    timelineEyebrow: "Notre parcours",
    timelineTitle: "Quelques étapes clés",
    timeline: [
      { year: "2022", title: "Le point de départ", body: "Tout a commencé sous le nom de People's Care Center, en aidant les enfants démunis avec des fournitures scolaires et des vivres, et en plaçant certains en apprentissage, comme la couture." },
      { year: "2023", title: "La croissance", body: "Nous avons commencé à rendre visite aux enfants malades à l'hôpital, à prier pour eux et à apporter des vivres à leurs familles." },
      { year: "2026", title: "Un nouveau nom : ShareHope", body: "People's Care Center est devenu ShareHope, en portant la même promesse. Et la liste continue." },
    ],
    valuesEyebrow: "Ce qui nous guide",
    valuesTitle: "Nos valeurs",
    values: [
      { title: "Donner maintenant", body: "S'il faut attendre le superflu pour donner, on ne donnera jamais." },
      { title: "Être la solution", body: "Nous cherchons où sont les besoins, et nous nous efforçons d'y répondre." },
      { title: "Le peu va loin", body: "Le peu que nous avons peut faire beaucoup plus qu'on ne le croit." },
      { title: "Ensemble", body: "C'est une tâche noble mais grande. Nous devons tous mettre la main à la pâte pour aider nos prochains." },
    ],
    teamEyebrow: "L'équipe derrière tout ça",
    teamTitle: "Rencontrez l'équipe",
    teamLead: "Une petite équipe, portée par des centaines de bénévoles et de partenaires locaux.",
    team: [
      { name: "Marie L.", role: "Fondatrice et directrice", bio: "A fondé ShareHope à partir d'une promesse d'enfance : que personne ne vive les difficultés qu'elle a connues.", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
      { name: "Kwame A.", role: "Responsable des programmes", bio: "Transforme les idées des communautés en programmes durables.", photo: "" },
      { name: "Sofia R.", role: "Partenariats communautaires", bio: "Crée des liens entre leaders locaux et soutiens.", photo: "" },
      { name: "Daniel T.", role: "Opérations", bio: "Veille à ce que chaque dollar et chaque projet soient suivis.", photo: "" },
    ],
    ctaTitle: "Faites partie de l'histoire.",
    ctaBody: "Donner, faire du bénévolat ou devenir partenaire — il y a une place pour vous ici.",
    ctaPrimary: "Faire un don",
    ctaSecondary: "Devenir bénévole",
  },
} as const;

export default function AboutContent({ locale, managed }: { locale: string; managed?: ManagedPageContent | null }) {
  const base = locale === "fr" ? copy.fr : copy.en;
  const t = { ...base, heroTitle: managed?.title || base.heroTitle, heroEyebrow: managed?.subtitle || base.heroEyebrow, heroLead: managed?.body || base.heroLead, ctaPrimary: managed?.buttonText || base.ctaPrimary };

  return (
    <div className="bg-brand-cream text-[#121212]">
      {/* Hero */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="space-y-6">
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#13306B]">{t.heroEyebrow}</p>
          <h1 className="font-serif text-4xl font-bold leading-tight text-brand-navy sm:text-5xl lg:text-6xl">
            {t.heroTitle}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">{t.heroLead}</p>
        </div>
        <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl shadow-xl">
          <Image
            src="https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=1200&q=80"
            alt="Community members gathered together"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      {/* Mission statement */}
      <section className="bg-brand-navy px-6 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#FFC72C]">{t.missionEyebrow}</p>
          <p className="font-serif mt-6 text-2xl font-medium leading-relaxed sm:text-3xl lg:text-4xl">
            {t.missionStatement}
          </p>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-[#E5E0D8] bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-mono-spaced text-xs font-bold uppercase text-[#F05A24]">{t.teamEyebrow}</p>
            <h2 className="font-serif mt-3 text-3xl font-bold text-brand-navy sm:text-4xl">{t.teamTitle}</h2>
            <p className="mx-auto mt-4 max-w-xl leading-relaxed text-slate-600">{t.teamLead}</p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.team.map((member, index) => (
              <article
                key={member.name}
                className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
              >
                <div className="relative aspect-square overflow-hidden bg-gradient-to-b from-[#E9E3D9] to-[#D9D1C4]">
                  <Image
                    src={member.photo || "/images/team-photo-placeholder.svg"}
                    alt={member.photo ? member.name : `${member.name} photo placeholder`}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    data-visual-key={`team-photo-${index + 1}`}
                  />
                </div>
                <div className="p-5 text-[#13306B]">
                  <h3 className="font-serif text-xl font-semibold">{member.name}</h3>
                  <p className="font-mono-spaced mt-1 text-[10px] font-bold uppercase text-[#13306B]/80">{member.role}</p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{member.bio}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="font-mono-spaced text-center text-xs font-bold uppercase text-[#13306B]">{t.timelineEyebrow}</p>
        <h2 className="font-serif mt-3 text-center text-3xl font-bold text-brand-navy sm:text-4xl">{t.timelineTitle}</h2>
        <div className="mt-12 space-y-0">
          {t.timeline.map((milestone) => (
            <div key={milestone.year} className="relative border-l-2 border-[#E5E0D8] pb-10 pl-8 last:pb-0">
              <span className="absolute -left-[9px] top-0 h-4 w-4 rounded-full border-4 border-[#FFC72C] bg-white" />
              <p className="font-mono-spaced text-xs font-bold uppercase text-[#F05A24]">{milestone.year}</p>
              <h3 className="font-serif mt-1.5 text-xl font-semibold text-brand-navy">{milestone.title}</h3>
              <p className="mt-2 max-w-lg text-sm leading-relaxed text-slate-600">{milestone.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-[#E5E0D8] bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono-spaced text-center text-xs font-bold uppercase text-[#13306B]">{t.valuesEyebrow}</p>
          <h2 className="font-serif mt-3 text-center text-3xl font-bold text-brand-navy sm:text-4xl">{t.valuesTitle}</h2>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {t.values.map((value, i) => (
              <div key={value.title} className="rounded-xl border border-[#E5E0D8] bg-[#FAF7F2] p-6">
                <span className="font-serif text-3xl font-bold text-[#FFC72C]">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="font-serif mt-4 text-lg font-semibold text-brand-navy">{value.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{value.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#FFC72C] px-6 py-16 text-center">
        <div className="mx-auto max-w-2xl space-y-5">
          <h2 className="font-serif text-3xl font-bold text-[#121212] sm:text-4xl">{t.ctaTitle}</h2>
          <p className="text-sm leading-relaxed text-[#121212]/80 sm:text-base">{t.ctaBody}</p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/donate"
              className="font-mono-spaced inline-flex items-center rounded-lg bg-brand-navy px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0a1f33]"
            >
              {t.ctaPrimary}
            </Link>
            <Link
              href="/volunteer"
              className="font-mono-spaced inline-flex items-center rounded-lg border-2 border-[#121212] px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-[#121212] transition-all hover:-translate-y-0.5 hover:bg-[#121212] hover:text-white"
            >
              {t.ctaSecondary}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

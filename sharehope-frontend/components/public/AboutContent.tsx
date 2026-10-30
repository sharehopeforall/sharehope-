import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { ManagedPageContent } from "@/lib/server/site-page";

const copy = {
  en: {
    heroEyebrow: "Our story",
    heroTitle: "Hope is a team effort.",
    heroLead: "ShareHope began with a simple belief: lasting change starts with local communities. Today, we partner with neighborhoods around the world to expand access to education, health, and opportunity.",
    missionEyebrow: "Our mission",
    missionStatement: "To walk alongside communities as they build the futures they imagine — with dignity, partnership, and lasting support.",
    timelineEyebrow: "How we got here",
    timelineTitle: "A few milestones along the way",
    timeline: [
      { year: "2016", title: "Where it began", body: "A small group of volunteers funded the first classroom supplies for one partner school." },
      { year: "2019", title: "Growing programs", body: "We expanded into health and community development, guided by what local leaders asked for." },
      { year: "2023", title: "Community-led model", body: "Every program is now designed and directed by the communities it serves." },
      { year: "Today", title: "Still growing", body: "Thousands of students, families, and neighbors shape what we do — and where we go next." },
    ],
    valuesEyebrow: "What guides us",
    valuesTitle: "Our values",
    values: [
      { title: "Community first", body: "Local leaders set the agenda. We follow their expertise." },
      { title: "Radical transparency", body: "We share where every dollar goes and report honestly on results." },
      { title: "Long-term commitment", body: "Real change takes time. We stay until communities lead on their own." },
      { title: "Dignity in everything", body: "The people we serve are partners and protagonists — never props." },
    ],
    teamEyebrow: "The people behind it",
    teamTitle: "Meet the team",
    teamLead: "A small team, powered by hundreds of volunteers and local partners.",
    team: [
      { name: "Marie L.", role: "Founder & Director", bio: "Started ShareHope with one classroom and a lot of hope.", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
      { name: "Kwame A.", role: "Programs Lead", bio: "Turns community ideas into programs that last.", photo: "" },
      { name: "Sofia R.", role: "Community Partnerships", bio: "Builds bridges between local leaders and supporters.", photo: "" },
      { name: "Daniel T.", role: "Operations", bio: "Keeps every dollar accountable and every project on track.", photo: "" },
    ],
    statsTitle: "By the numbers",
    stats: [
      { value: "9", label: "Years of work" },
      { value: "12", label: "Countries" },
      { value: "38,000+", label: "People reached" },
      { value: "100%", label: "Community-led" },
    ],
    ctaTitle: "Be part of the story.",
    ctaBody: "Whether you give, volunteer, or partner with us — there's a place for you here.",
    ctaPrimary: "Donate",
    ctaSecondary: "Volunteer",
  },
  fr: {
    heroEyebrow: "Notre histoire",
    heroTitle: "L'espoir est un travail d'équipe.",
    heroLead: "ShareHope est née d'une conviction simple : le changement durable commence avec les communautés locales. Aujourd'hui, nous collaborons avec des quartiers du monde entier pour élargir l'accès à l'éducation, à la santé et aux opportunités.",
    missionEyebrow: "Notre mission",
    missionStatement: "Accompagner les communautés dans la construction de l'avenir qu'elles imaginent — avec dignité, partenariat et soutien durable.",
    timelineEyebrow: "Notre parcours",
    timelineTitle: "Quelques étapes clés",
    timeline: [
      { year: "2016", title: "Le point de départ", body: "Un petit groupe de bénévoles finance les premières fournitures scolaires d'une école partenaire." },
      { year: "2019", title: "Des programmes qui grandissent", body: "Nous nous ouvrons à la santé et au développement communautaire, guidés par les demandes des leaders locaux." },
      { year: "2023", title: "Un modèle communautaire", body: "Chaque programme est désormais conçu et dirigé par les communautés qu'il sert." },
      { year: "Aujourd'hui", title: "Toujours en croissance", body: "Des milliers d'élèves, de familles et de voisins façonnent ce que nous faisons — et où nous allons." },
    ],
    valuesEyebrow: "Ce qui nous guide",
    valuesTitle: "Nos valeurs",
    values: [
      { title: "La communauté d'abord", body: "Les leaders locaux fixent le cap. Nous suivons leur expertise." },
      { title: "Transparence radicale", body: "Nous montrons où va chaque dollar et rendons compte honnêtement." },
      { title: "Engagement à long terme", body: "Le vrai changement prend du temps. Nous restons jusqu'à ce que les communautés mènent seules." },
      { title: "La dignité avant tout", body: "Les personnes que nous servons sont des partenaires et des protagonistes — jamais des accessoires." },
    ],
    teamEyebrow: "L'équipe derrière tout ça",
    teamTitle: "Rencontrez l'équipe",
    teamLead: "Une petite équipe, portée par des centaines de bénévoles et de partenaires locaux.",
    team: [
      { name: "Marie L.", role: "Fondatrice et directrice", bio: "A lancé ShareHope avec une salle de classe et beaucoup d'espoir.", photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80" },
      { name: "Kwame A.", role: "Responsable des programmes", bio: "Transforme les idées des communautés en programmes durables.", photo: "" },
      { name: "Sofia R.", role: "Partenariats communautaires", bio: "Crée des liens entre leaders locaux et soutiens.", photo: "" },
      { name: "Daniel T.", role: "Opérations", bio: "Veille à ce que chaque dollar et chaque projet soient suivis.", photo: "" },
    ],
    statsTitle: "En chiffres",
    stats: [
      { value: "9", label: "Années d'action" },
      { value: "12", label: "Pays" },
      { value: "38 000+", label: "Personnes touchées" },
      { value: "100 %", label: "Mené par les communautés" },
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
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#2D8A56]">{t.heroEyebrow}</p>
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
        <p className="font-mono-spaced text-center text-xs font-bold uppercase text-[#2D8A56]">{t.timelineEyebrow}</p>
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
          <p className="font-mono-spaced text-center text-xs font-bold uppercase text-[#2D8A56]">{t.valuesEyebrow}</p>
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

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 py-16 text-center">
        <h2 className="font-mono-spaced text-xs font-bold uppercase text-slate-500">{t.statsTitle}</h2>
        <div className="mt-10 grid grid-cols-2 gap-8 sm:grid-cols-4">
          {t.stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-serif text-4xl font-bold text-brand-navy sm:text-5xl">{stat.value}</p>
              <p className="font-mono-spaced mt-2 text-[11px] font-bold uppercase text-slate-500">{stat.label}</p>
            </div>
          ))}
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

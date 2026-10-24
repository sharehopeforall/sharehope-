import Image from "next/image";
import { ArrowRight, Droplets, HeartPulse, Stethoscope } from "lucide-react";
import { Link } from "@/i18n/navigation";

const images = {
  hero: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1600&q=85",
  clinic: "https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=1000&q=85",
  water: "https://images.unsplash.com/photo-1541257710737-06d667133a53?auto=format&fit=crop&w=1000&q=85",
  nutrition: "https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&w=1000&q=85",
  wide: "https://images.unsplash.com/photo-1531983412531-1f49a365ffed?auto=format&fit=crop&w=1800&q=85",
};

const copy = {
  en: {
    heroEyebrow: "Health & Wellness",
    heroTitle: "Care shouldn't depend on where you're born.",
    heroBody:
      "Mobile clinics, clean water, and nutrition support bring essential care to communities where the nearest hospital can be days away.",
    heroCta: "Support health",
    heroSecondary: "See how it works ↓",
    stats: [
      { value: "696M", label: "people lack access to basic healthcare" },
      { value: "1 in 3", label: "people worldwide lack safely managed drinking water" },
      { value: "80%", label: "of common illnesses are preventable with basic care" },
    ],
    featuresEyebrow: "What we deliver",
    featuresTitle: "Three ways care reaches the field.",
    features: [
      {
        icon: Stethoscope,
        title: "Mobile clinics",
        body: "Vaccinations, checkups, and maternal care delivered directly to remote villages by traveling medical teams.",
        image: images.clinic,
      },
      {
        icon: Droplets,
        title: "Clean water",
        body: "Solar-powered wells, filtration systems, and hygiene education that stop disease before it starts.",
        image: images.water,
      },
      {
        icon: HeartPulse,
        title: "Nutrition programs",
        body: "Meal programs, supplements, and maternal nutrition that fight malnutrition in its earliest stages.",
        image: images.nutrition,
      },
    ],
    quoteText:
      "For the first time, a doctor came to us. My children were checked, vaccinated, and cared for — in our own village.",
    quoteAttribution: "Mother of three — Tigray region, Ethiopia",
    bandTitle: "Care within reach changes everything.",
    bandBody:
      "Healthy children stay in school. Parents can work and plan. Entire communities gain the strength to grow on their own terms.",
    bandCta: "Give to health",
    pledgeTitle: "Where your gift goes",
    pledges: [
      { amount: "$25", impact: "provides vaccinations for a child" },
      { amount: "$50", impact: "funds a mobile clinic visit for a family" },
      { amount: "$120", impact: "helps maintain a community water well" },
    ],
  },
  fr: {
    heroEyebrow: "Santé et bien-être",
    heroTitle: "Les soins ne devraient pas dépendre du lieu de naissance.",
    heroBody:
      "Cliniques mobiles, eau potable et soutien nutritionnel apportent des soins essentiels aux communautés où l'hôpital le plus proche peut être à des jours de distance.",
    heroCta: "Soutenir la santé",
    heroSecondary: "Voir comment ça fonctionne ↓",
    stats: [
      { value: "696 M", label: "de personnes n'ont pas accès aux soins de base" },
      { value: "1 sur 3", label: "personne dans le monde n'a pas d'eau potable gérée en toute sécurité" },
      { value: "80 %", label: "des maladies courantes sont évitables avec des soins de base" },
    ],
    featuresEyebrow: "Ce que nous offrons",
    featuresTitle: "Trois façons d'apporter des soins sur le terrain.",
    features: [
      {
        icon: Stethoscope,
        title: "Cliniques mobiles",
        body: "Vaccins, examens et soins maternels livrés directement dans les villages éloignés par des équipes médicales itinérantes.",
        image: images.clinic,
      },
      {
        icon: Droplets,
        title: "Eau potable",
        body: "Puits solaires, systèmes de filtration et éducation à l'hygiène qui arrêtent la maladie avant qu'elle ne commence.",
        image: images.water,
      },
      {
        icon: HeartPulse,
        title: "Programmes de nutrition",
        body: "Repas, suppléments et nutrition maternelle qui combattent la malnutrition dès ses débuts.",
        image: images.nutrition,
      },
    ],
    quoteText:
      "Pour la première fois, un médecin est venu à nous. Mes enfants ont été examinés, vaccinés et soignés — dans notre propre village.",
    quoteAttribution: "Mère de trois enfants — région du Tigré, Éthiopie",
    bandTitle: "Des soins à portée de main changent tout.",
    bandBody:
      "Les enfants en santé restent à l'école. Les parents peuvent travailler et planifier. Des communautés entières gagnent la force de grandir selon leurs propres termes.",
    bandCta: "Donner pour la santé",
    pledgeTitle: "Où va votre don",
    pledges: [
      { amount: "25 $", impact: "offre les vaccins d'un enfant" },
      { amount: "50 $", impact: "finance une visite de clinique mobile pour une famille" },
      { amount: "120 $", impact: "aide à entretenir un puits communautaire" },
    ],
  },
} as const;

export default function HealthContent({ locale }: { locale: string }) {
  const t = locale === "fr" ? copy.fr : copy.en;

  return (
    <div className="bg-white text-brand-navy">
      {/* Split hero */}
      <section className="grid lg:grid-cols-2">
        <div className="flex items-center bg-[#FAF6ED] px-6 py-16 sm:py-24 lg:pl-16 lg:pr-12 xl:pl-24">
          <div className="max-w-xl">
            <p className="type-eyebrow text-brand-green">{t.heroEyebrow}</p>
            <h1 className="mt-5 text-balance font-serif text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-6xl">
              {t.heroTitle}
            </h1>
            <p className="mt-6 text-lg leading-8 text-brand-body">{t.heroBody}</p>
            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/donate?program=health"
                className="inline-flex items-center gap-3 rounded-sm bg-[#FFC72C] px-7 py-4 text-sm font-black uppercase tracking-[0.12em] text-brand-navy transition hover:-translate-y-0.5 hover:bg-[#e6b32a]"
              >
                {t.heroCta}
                <ArrowRight size={18} />
              </Link>
              <a href="#features" className="text-sm font-bold text-brand-green underline-offset-4 hover:underline">
                {t.heroSecondary}
              </a>
            </div>
          </div>
        </div>
        <div className="relative min-h-[320px] lg:min-h-[640px]">
          <Image src={images.hero} alt="Community members receiving care at a mobile clinic" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
        </div>
      </section>

      {/* Stats band */}
      <section className="bg-brand-navy text-white">
        <dl className="mx-auto grid max-w-6xl divide-y divide-white/15 px-6 py-14 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {t.stats.map((stat) => (
            <div key={stat.value} className="px-2 py-6 text-center sm:px-8 sm:py-0">
              <dd className="font-serif text-4xl font-semibold text-[#FFC72C] sm:text-5xl">{stat.value}</dd>
              <dt className="mt-3 text-sm leading-snug text-white/80">{stat.label}</dt>
            </div>
          ))}
        </dl>
      </section>

      {/* Feature rows */}
      <section id="features" className="bg-[#FAF6ED] px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="max-w-2xl">
            <p className="type-eyebrow text-brand-orange">{t.featuresEyebrow}</p>
            <h2 className="type-section-title mt-5 text-balance">{t.featuresTitle}</h2>
          </div>
          <div className="mt-16 space-y-16">
            {t.features.map((feature, index) => {
              const Icon = feature.icon;
              const reversed = index % 2 === 1;
              return (
                <article key={feature.title} className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
                  <div className={`relative aspect-[4/3] overflow-hidden rounded-sm shadow-xl lg:col-span-5 ${reversed ? "lg:order-2" : ""}`}>
                    <Image src={feature.image} alt={feature.title} fill sizes="(min-width: 1024px) 42vw, 100vw" className="object-cover" />
                  </div>
                  <div className={`lg:col-span-7 ${reversed ? "lg:order-1" : ""}`}>
                    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-green/10 text-brand-green">
                      <Icon size={28} strokeWidth={1.75} />
                    </div>
                    <h3 className="mt-6 font-serif text-3xl font-semibold leading-tight sm:text-4xl">{feature.title}</h3>
                    <p className="mt-5 max-w-xl text-lg leading-8 text-brand-body">{feature.body}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote */}
      <section className="relative isolate overflow-hidden px-6 py-24 text-white sm:py-32">
        <Image src={images.wide} alt="Children playing near a clean water source" fill sizes="100vw" className="-z-20 object-cover" />
        <div className="absolute inset-0 -z-10 bg-brand-green/80" />
        <blockquote className="mx-auto max-w-4xl text-center">
          <p className="text-balance font-serif text-3xl font-semibold leading-snug sm:text-4xl lg:text-5xl">“{t.quoteText}”</p>
          <footer className="mt-8 text-sm uppercase tracking-[0.18em] text-white/80">{t.quoteAttribution}</footer>
        </blockquote>
      </section>

      {/* Pledge grid */}
      <section className="px-6 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <h2 className="type-section-title text-center text-balance">{t.pledgeTitle}</h2>
          <div className="mt-14 grid gap-6 sm:grid-cols-3">
            {t.pledges.map((pledge) => (
              <Link
                key={pledge.amount}
                href="/donate?program=health"
                className="group rounded-lg border border-[#E5E0D8] bg-[#FAF6ED] p-8 text-center transition hover:-translate-y-1 hover:border-brand-green hover:shadow-xl"
              >
                <p className="font-serif text-4xl font-semibold text-brand-green">{pledge.amount}</p>
                <p className="mt-4 leading-7 text-brand-body">{pledge.impact}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-brand-navy group-hover:text-brand-green">
                  {t.bandCta}
                  <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-[#FFC72C] px-6 py-20 sm:py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-balance font-serif text-4xl font-semibold leading-tight sm:text-6xl">{t.bandTitle}</h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-brand-navy/80">{t.bandBody}</p>
          <Link href="/donate?program=health" className="mt-9 inline-flex items-center gap-3 rounded-sm bg-brand-navy px-8 py-4 text-sm font-black uppercase tracking-[0.12em] text-white transition hover:-translate-y-0.5 hover:bg-brand-green">
            {t.bandCta}
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
}

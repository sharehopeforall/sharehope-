import Image from "next/image";
import { ArrowRight, GraduationCap, HeartHandshake, Home, ShoppingBasket, Store, Wallet } from "lucide-react";
import { Link } from "@/i18n/navigation";

const images = {
  hero: "https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=2000&q=85",
  family: "https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1000&q=85",
  widows: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?auto=format&fit=crop&w=1200&q=85",
};

const ITEM_ICONS = {
  basket: ShoppingBasket,
  wallet: Wallet,
  school: GraduationCap,
  heart: HeartHandshake,
  store: Store,
  home: Home,
} as const;

const copy = {
  en: {
    heroEyebrow: "Community Development",
    heroTitle: "No family should walk through hardship alone.",
    heroBody:
      "We stand with struggling families and widows in need — with financial support, practical care, and a community that shows up.",
    heroCta: "Support community",
    howLabel: "How we help",
    focus: [
      {
        key: "families",
        label: "Family support",
        title: "Families in need",
        body: "Many families are one emergency away from crisis. We help parents cover the basics, keep their children in school, and find stability again.",
        image: images.family,
        imageAlt: "A family together at home",
        items: [
          { icon: "basket", title: "Food & essentials", body: "Food baskets and household supplies when money runs out." },
          { icon: "wallet", title: "Emergency financial help", body: "Help with rent, medical bills, and urgent needs." },
          { icon: "school", title: "School support", body: "Fees, uniforms, and supplies so children stay in class." },
          { icon: "heart", title: "Care & counseling", body: "Encouragement, parenting support, and prayer." },
        ],
        cta: "Support a family",
      },
      {
        key: "widows",
        label: "Widows in need",
        title: "No widow should face hardship alone",
        body: "Losing a husband often means losing the family's main income. We walk alongside widows with direct financial support and care, so they can provide for their children with dignity.",
        image: images.widows,
        imageAlt: "A widow receiving support at her home",
        items: [
          { icon: "wallet", title: "Monthly financial assistance", body: "Regular support to cover food, rent, and daily needs." },
          { icon: "school", title: "Help for her children", body: "School fees and supplies for widows' children." },
          { icon: "store", title: "A path to income", body: "Seed funding and training to start a small business." },
          { icon: "home", title: "Visits & fellowship", body: "Home visits, community, and prayer so no one is forgotten." },
        ],
        cta: "Support a widow",
      },
    ],
  },
  fr: {
    heroEyebrow: "Développement communautaire",
    heroTitle: "Aucune famille ne devrait traverser l'épreuve seule.",
    heroBody:
      "Nous soutenons les familles en difficulté et les veuves dans le besoin — par une aide financière, un soutien concret et une communauté présente.",
    heroCta: "Soutenir la communauté",
    howLabel: "Comment nous aidons",
    focus: [
      {
        key: "families",
        label: "Soutien familial",
        title: "Familles dans le besoin",
        body: "Beaucoup de familles sont à une urgence de la crise. Nous aidons les parents à couvrir l'essentiel, à garder leurs enfants à l'école et à retrouver la stabilité.",
        image: images.family,
        imageAlt: "Une famille réunie à la maison",
        items: [
          { icon: "basket", title: "Nourriture et essentiels", body: "Paniers alimentaires et produits de base quand l'argent manque." },
          { icon: "wallet", title: "Aide financière d'urgence", body: "Aide pour le loyer, les frais médicaux et les besoins urgents." },
          { icon: "school", title: "Soutien scolaire", body: "Frais, uniformes et fournitures pour que les enfants restent en classe." },
          { icon: "heart", title: "Écoute et accompagnement", body: "Encouragement, soutien parental et prière." },
        ],
        cta: "Soutenir une famille",
      },
      {
        key: "widows",
        label: "Veuves dans le besoin",
        title: "Aucune veuve ne devrait affronter l'épreuve seule",
        body: "Perdre son mari signifie souvent perdre le principal revenu de la famille. Nous accompagnons les veuves avec un soutien financier direct et une présence, pour qu'elles subviennent aux besoins de leurs enfants dans la dignité.",
        image: images.widows,
        imageAlt: "Une veuve reçoit du soutien chez elle",
        items: [
          { icon: "wallet", title: "Aide financière mensuelle", body: "Un soutien régulier pour la nourriture, le loyer et le quotidien." },
          { icon: "school", title: "Aide pour ses enfants", body: "Frais et fournitures scolaires pour les enfants des veuves." },
          { icon: "store", title: "Un chemin vers un revenu", body: "Fonds de démarrage et formation pour lancer une petite entreprise." },
          { icon: "home", title: "Visites et communion", body: "Visites à domicile, communauté et prière pour que personne ne soit oublié." },
        ],
        cta: "Soutenir une veuve",
      },
    ],
  },
} as const;

export default function CommunityContent({ locale }: { locale: string }) {
  const t = locale === "fr" ? copy.fr : copy.en;

  return (
    <div className="overflow-hidden bg-[#F7F1E6] text-brand-navy">
      <section className="bg-brand-navy text-white">
        <div className="mx-auto grid max-w-[1440px] lg:min-h-[640px] lg:grid-cols-2">
          <div className="order-2 flex items-center px-6 py-14 sm:px-10 sm:py-20 lg:order-1 lg:px-16 xl:px-24">
            <div className="max-w-xl">
              <p className="type-eyebrow flex items-center gap-3 text-[#F6C54B]">
                <span className="h-px w-10 bg-current" />
                {t.heroEyebrow}
              </p>
              <h1 className="mt-6 text-balance font-serif text-[clamp(2.75rem,5.2vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em]">
                {t.heroTitle}
              </h1>
              <p className="mt-8 max-w-lg text-lg leading-8 text-white/72 sm:text-xl">{t.heroBody}</p>
              <Link href="/donate?program=community" className="group mt-10 inline-flex items-center gap-5 rounded-full bg-[#F6C54B] py-2 pl-6 pr-2 text-sm font-black uppercase tracking-[0.11em] text-brand-navy transition hover:bg-white">
                {t.heroCta}
                <span className="flex size-11 items-center justify-center rounded-full bg-brand-navy text-white transition group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </Link>
            </div>
          </div>
          <div className="relative order-1 min-h-[320px] overflow-hidden sm:min-h-[420px] lg:order-2 lg:min-h-full">
            <Image src={images.hero} alt="Families gathered together" fill priority sizes="(min-width: 1024px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/35 via-transparent to-transparent lg:bg-gradient-to-r lg:from-brand-navy/25 lg:via-transparent" />
          </div>
        </div>
      </section>

      <section className="px-6 py-20 sm:px-10 sm:py-24 lg:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-24 lg:space-y-32">
            {t.focus.map((area, index) => {
              const widows = area.key === "widows";
              const accent = widows ? "text-brand-orange" : "text-brand-green";
              const accentBg = widows ? "bg-brand-orange" : "bg-brand-green";
              return (
                <article key={area.key}>
                  <div className="grid items-center lg:grid-cols-12">
                    <div className={`relative h-[300px] overflow-hidden rounded-3xl sm:h-[420px] lg:row-start-1 lg:h-[520px] ${widows ? "lg:col-span-8 lg:col-start-5" : "lg:col-span-8 lg:col-start-1"}`}>
                      <Image src={area.image} alt={area.imageAlt} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" />
                    </div>
                    <div
                      className={`relative z-10 -mt-16 mx-4 rounded-3xl bg-white p-8 shadow-[0_24px_70px_rgba(15,41,66,0.16)] sm:mx-8 sm:p-10 lg:row-start-1 lg:mx-0 lg:mt-0 lg:p-12 ${
                        widows ? "lg:col-span-6 lg:col-start-1" : "lg:col-span-6 lg:col-start-7"
                      }`}
                    >
                      <p className={`flex items-center gap-3 text-xs font-black uppercase tracking-[0.18em] ${accent}`}>
                        <span className={`h-0.5 w-8 ${accentBg}`} />
                        0{index + 1} · {area.label}
                      </p>
                      <h3 className="mt-5 text-balance font-serif text-3xl font-semibold leading-[1.08] tracking-[-0.025em] sm:text-4xl">{area.title}</h3>
                      <p className="mt-5 text-base leading-7 text-brand-body sm:text-lg sm:leading-8">{area.body}</p>
                      <Link
                        href={widows ? "/donate?program=widows&frequency=monthly" : "/donate?program=families"}
                        className="group mt-8 inline-flex items-center gap-4 rounded-full bg-[#F6C54B] py-2 pl-6 pr-2 text-sm font-black uppercase tracking-[0.11em] text-brand-navy transition hover:bg-brand-navy hover:text-white"
                      >
                        {area.cta}
                        <span className="flex size-10 items-center justify-center rounded-full bg-brand-navy text-white transition group-hover:translate-x-1 group-hover:bg-[#F6C54B] group-hover:text-brand-navy">
                          <ArrowRight size={17} />
                        </span>
                      </Link>
                    </div>
                  </div>

                  <div className="mt-10 lg:mt-14">
                    <p className={`type-eyebrow ${accent}`}>{t.howLabel}</p>
                    <ul className="mt-5 grid gap-px overflow-hidden rounded-2xl bg-brand-navy/10 sm:grid-cols-2 lg:grid-cols-4">
                      {area.items.map((item) => {
                        const Icon = ITEM_ICONS[item.icon];
                        return (
                          <li key={item.title} className="bg-[#F7F1E6] p-6 lg:p-7">
                            <Icon size={24} strokeWidth={1.6} className={accent} />
                            <p className="mt-4 font-bold leading-snug">{item.title}</p>
                            <p className="mt-2 text-sm leading-6 text-brand-body">{item.body}</p>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}

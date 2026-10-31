"use client";

import { useState, type ChangeEvent } from "react";
import Image from "next/image";
import DonationPaymentModal from "@/components/public/DonationPaymentModal";

type DonationFrequency = "monthly" | "once";

interface PhotoItem {
  id: number;
  cardLabel: string;
  cardLocation: string;
  title: string;
  location: string;
  src: string;
  desc: string;
  rotationClass: string;
}

export type HeroPhotoContent = Pick<PhotoItem, "cardLabel" | "cardLocation" | "title" | "location" | "desc">;

export interface HeroContent {
  kicker?: string | null;
  headline?: string | null;
  description?: string | null;
  buttonText?: string | null;
  photoUrls?: Array<string | null> | null;
  showSecureMessage?: boolean;
  photos?: Array<Partial<HeroPhotoContent>> | null;
}

export interface HeroEditor {
  onChange: (field: "kicker" | "headline" | "description" | "buttonText", value: string) => void;
}

const PRESET_AMOUNTS = [15, 30, 60, 120] as const;

const content = {
  en: {
    kicker: "FOR MILLIONS OF CHILDREN & FAMILIES",
    headline: "A Brighter Day",
    description:
      "For millions, a brighter day still hasn't arrived. Your gift helps children and young adults access education, healthcare, and opportunities to build a brighter future.",
    frequencyMonthly: "MONTHLY",
    frequencyOnce: "GIVE ONCE",
    amountLabel: "CHOOSE/ENTER AN AMOUNT TO GIVE",
    presetSuffixMonthly: "USD/mo",
    presetSuffixOnce: "USD",
    customToggle: "Other amount",
    customPlaceholder: "Enter custom amount",
    customCurrency: "USD",
    submitMonthly: "SUPPORT TODAY",
    submitOnce: "GIVE TODAY",
    trustLeft: "SSL Encrypted & Secure",
    trustRight: "100% Direct Program Funding",
    galleryCaptionLeft: "Real stories from the field",
    galleryCaptionRight: "Click photo to expand",
    clickToView: "Click to View",
    impactCustomValid: (amount: number, monthly: boolean) =>
      `Your gift of $${amount} USD ${monthly ? "every month " : ""}directly powers sustainable field operations.`,
    impactCustomInvalid: "Please enter a valid gift amount.",
    impactFallback: "Direct community support.",
    impactMap: {
      monthly: {
        15: "Gives 2 families durable aid and clean water every year.",
        30: "Gives 4 families durable aid and clean water every year.",
        60: "Supports year-round community programs.",
        120: "Gives 16 families durable aid and schooling support every year.",
      } as Record<number, string>,
      once: {
        15: "Provides essential clean water filtration for 1 child.",
        30: "Provides emergency clean water kits for 2 households.",
        60: "Supports student learning and well-being.",
        120: "Sponsors vocational training tools and healthcare kits for a family.",
      } as Record<number, string>,
    },
    photos: [
      {
        cardLabel: "SCHOOLING PROGRAM",
        cardLocation: "Nairobi, Kenya • Solar Education",
        title: "Solar-Powered Learning Center",
        location: "Nairobi, Kenya • Primary Education",
        desc: "Over 450 students attend this solar-powered primary learning center equipped with clean water filtration and daily warm meal programs.",
      },
      {
        cardLabel: "CLEAN WATER WELLS",
        cardLocation: "Tigray, Ethiopia • Safe Water Access",
        title: "Deep Well Clean Water Station",
        location: "Tigray, Ethiopia • Safe Water Well",
        desc: "Constructed deep solar pump wells serving over 3,200 villagers, eliminating daily 4-hour water fetch walks for women and girls.",
      },
      {
        cardLabel: "VOCATIONAL TRAINING",
        cardLocation: "Rajasthan, India • Skills Workshops",
        title: "Vocational Skills Workshop",
        location: "Rajasthan, India • Young Adults",
        desc: "Providing 12-week accredited technical training programs empowering youth to launch local micro-enterprises and sustainable livelihoods.",
      },
      {
        cardLabel: "HEALTHCARE & AID",
        cardLocation: "Blantyre, Malawi • Mobile Medical Care",
        title: "Mobile Healthcare & Emergency Aid",
        location: "Blantyre, Malawi • Healthcare & Aid",
        desc: "Mobile health clinics providing vaccinations, maternal care, and essential nutrition kits across 14 rural village clusters.",
      },
    ],
    modal: {
      demoLabel: "CONFIRMATION DEMO",
      title: "Thank You for Supporting SHAREHOPE",
      giftTypeLabel: "Gift Type:",
      giftTypeMonthly: "Monthly Partner",
      giftTypeOnce: "One-Time Contribution",
      amountLabel: "Amount:",
      impactLabel: "Impact Summary:",
      close: "Close Preview",
    },
    closeAria: "Close",
  },
  fr: {
    kicker: "POUR DES MILLIONS D'ENFANTS ET DE FAMILLES",
    headline: "Un jour meilleur",
    description:
      "Pour des millions de personnes, un jour meilleur n'est pas encore arrivé. Votre don aide les enfants et les jeunes adultes à accéder à l'éducation, aux soins de santé et à des occasions de bâtir un avenir meilleur.",
    frequencyMonthly: "MENSUEL",
    frequencyOnce: "DON UNIQUE",
    amountLabel: "CHOISISSEZ OU ENTREZ UN MONTANT",
    presetSuffixMonthly: "USD/mois",
    presetSuffixOnce: "USD",
    customToggle: "Autre montant",
    customPlaceholder: "Entrez un montant personnalisé",
    customCurrency: "USD",
    submitMonthly: "SOUTENIR AUJOURD'HUI",
    submitOnce: "DONNER AUJOURD'HUI",
    trustLeft: "Chiffrement SSL sécurisé",
    trustRight: "100 % des fonds au terrain",
    galleryCaptionLeft: "Des histoires vécues sur le terrain",
    galleryCaptionRight: "Cliquez sur une photo pour l'agrandir",
    clickToView: "Cliquer pour voir",
    impactCustomValid: (amount: number, monthly: boolean) =>
      `Votre don de ${amount} $ USD ${monthly ? "chaque mois " : ""}alimente directement des opérations durables sur le terrain.`,
    impactCustomInvalid: "Veuillez entrer un montant valide.",
    impactFallback: "Soutien direct à la communauté.",
    impactMap: {
      monthly: {
        15: "Offre une aide durable et de l'eau potable à 2 familles chaque année.",
        30: "Offre une aide durable et de l'eau potable à 4 familles chaque année.",
        60: "Soutient les programmes communautaires toute l’année.",
        120: "Offre une aide durable et un soutien scolaire à 16 familles chaque année.",
      } as Record<number, string>,
      once: {
        15: "Fournit une filtration d'eau potable essentielle pour 1 enfant.",
        30: "Fournit des trousses d'eau potable d'urgence pour 2 foyers.",
        60: "Soutient l’apprentissage et le bien-être des élèves.",
        120: "Parraine des outils de formation professionnelle et des trousses de santé pour une famille.",
      } as Record<number, string>,
    },
    photos: [
      {
        cardLabel: "PROGRAMME SCOLAIRE",
        cardLocation: "Nairobi, Kenya • Éducation solaire",
        title: "Centre d'apprentissage alimenté à l'énergie solaire",
        location: "Nairobi, Kenya • Éducation primaire",
        desc: "Plus de 450 élèves fréquentent ce centre d'apprentissage primaire alimenté à l'énergie solaire, doté d'une filtration d'eau potable et de programmes de repas chauds quotidiens.",
      },
      {
        cardLabel: "PUITS D'EAU POTABLE",
        cardLocation: "Tigré, Éthiopie • Accès à l'eau potable",
        title: "Station d'eau potable à puits profond",
        location: "Tigré, Éthiopie • Puits d'eau sécuritaire",
        desc: "Construction de puits à pompe solaire profonds desservant plus de 3 200 villageois, éliminant les trajets quotidiens de 4 heures pour aller chercher de l'eau pour les femmes et les filles.",
      },
      {
        cardLabel: "FORMATION PROFESSIONNELLE",
        cardLocation: "Rajasthan, Inde • Ateliers de compétences",
        title: "Atelier de compétences professionnelles",
        location: "Rajasthan, Inde • Jeunes adultes",
        desc: "Programmes de formation technique accrédités de 12 semaines permettant aux jeunes de lancer des micro-entreprises locales et des moyens de subsistance durables.",
      },
      {
        cardLabel: "SANTÉ ET AIDE",
        cardLocation: "Blantyre, Malawi • Soins médicaux mobiles",
        title: "Soins de santé mobiles et aide d'urgence",
        location: "Blantyre, Malawi • Santé et aide",
        desc: "Des cliniques mobiles offrant vaccination, soins maternels et trousses nutritionnelles essentielles dans 14 groupes de villages ruraux.",
      },
    ],
    modal: {
      demoLabel: "DÉMONSTRATION DE CONFIRMATION",
      title: "Merci de soutenir SHAREHOPE",
      giftTypeLabel: "Type de don :",
      giftTypeMonthly: "Partenaire mensuel",
      giftTypeOnce: "Contribution unique",
      amountLabel: "Montant :",
      impactLabel: "Résumé de l'impact :",
      close: "Fermer l'aperçu",
    },
    closeAria: "Fermer",
  },
} as const;

export function getDefaultHeroPhotos(locale: "en" | "fr"): HeroPhotoContent[] {
  return content[locale].photos.map((photo) => ({ ...photo }));
}

export default function Hero({
  locale = "en",
  content: managedContent,
  editor,
}: {
  locale?: string;
  content?: HeroContent;
  editor?: HeroEditor;
}) {
  const builtInPage = locale === "fr" ? content.fr : content.en;
  const page = {
    ...builtInPage,
    kicker: managedContent?.kicker ?? builtInPage.kicker,
    headline: managedContent?.headline ?? builtInPage.headline,
    description: managedContent?.description ?? builtInPage.description,
    submitMonthly: managedContent?.buttonText ?? builtInPage.submitMonthly,
    submitOnce: managedContent?.buttonText ?? builtInPage.submitOnce,
    photos: builtInPage.photos.map((photo, index) => ({
      ...photo,
      ...(managedContent?.photos?.[index] ?? {}),
    })),
  };

  const [frequency, setFrequency] = useState<DonationFrequency>("monthly");
  const [amount, setAmount] = useState<number>(60);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [customValue, setCustomValue] = useState<string>("");
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);

  const handleSelectPreset = (selectedAmount: number): void => {
    setAmount(selectedAmount);
    setIsCustom(false);
  };

  const handleCustomInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    const val = event.target.value;
    setCustomValue(val);
    const parsed = parseFloat(val);
    setAmount(Number.isNaN(parsed) ? 0 : parsed);
  };

  const getImpactMessage = (): string => {
    if (isCustom) {
      return amount > 0
        ? page.impactCustomValid(amount, frequency === "monthly")
        : page.impactCustomInvalid;
    }
    return page.impactMap[frequency][amount] || page.impactFallback;
  };

  return (
    <>
      <section className="relative flex min-h-[calc(100vh-80px)] items-center overflow-hidden bg-[#FAF7F2] px-6 py-10 text-[#121212] selection:bg-[#FFC72C] selection:text-[#121212]">
        <>
          <div className="absolute inset-0">
            <Image
              src="/images/sharehope-cover.png"
              alt=""
              fill
              priority
              unoptimized
              sizes="100vw"
              className="object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/78 to-[#FAF7F2]/5 sm:via-[#FAF7F2]/55 lg:via-[#FAF7F2]/20" />
        </>

        <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-8">
          {/* Left column */}
          <div className="z-20 flex flex-col justify-center space-y-6 lg:col-span-5">
            <div className="space-y-2.5">
              {editor && <input aria-label="Hero kicker" value={page.kicker} onChange={(event) => editor.onChange("kicker", event.target.value)} className="w-full border-0 bg-transparent p-0 font-mono-spaced text-[11px] font-bold uppercase tracking-[0.22em] text-neutral-700 outline-none ring-offset-2 focus:ring-2 focus:ring-[#FFC72C] sm:text-xs" />}

              {editor ? <textarea aria-label="Hero headline" rows={2} value={page.headline} onChange={(event) => editor.onChange("headline", event.target.value)} className="w-full resize-none border-0 bg-transparent p-0 font-handwriting text-5xl font-bold leading-[0.95] text-[#121212] outline-none ring-offset-2 focus:ring-2 focus:ring-[#FFC72C] sm:text-6xl lg:text-6xl xl:text-7xl" /> : <h1 className="select-none py-1 font-handwriting text-5xl font-bold leading-[0.95] text-[#121212] sm:text-6xl lg:text-6xl xl:text-7xl">{page.headline}</h1>}

              {editor ? <textarea aria-label="Hero description" rows={4} value={page.description} onChange={(event) => editor.onChange("description", event.target.value)} className="w-full max-w-lg resize-none border-0 bg-transparent p-0 text-sm font-medium leading-relaxed text-neutral-700 outline-none ring-offset-2 focus:ring-2 focus:ring-[#FFC72C] sm:text-base" /> : <p className="max-w-lg text-sm font-medium leading-relaxed text-neutral-700 sm:text-base">{page.description}</p>}
            </div>

            <div className="mt-2 w-full max-w-md overflow-hidden rounded border border-[#E5E0D8] bg-[#FAF7F2] shadow-xl">
              {/* Frequency selector */}
              <div className="grid grid-cols-2 border-b border-[#E5E0D8] bg-[#EFECE6] p-1">
                <button
                  type="button"
                  onClick={() => setFrequency("monthly")}
                  className={`flex items-center justify-center gap-1.5 py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    frequency === "monthly"
                      ? "bg-[#FFC72C] text-[#121212] shadow-sm"
                      : "text-neutral-600 hover:text-[#121212]"
                  }`}
                >
                  {page.frequencyMonthly} <span aria-hidden="true">♡</span>
                </button>

                <button
                  type="button"
                  onClick={() => setFrequency("once")}
                  className={`py-3 text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    frequency === "once"
                      ? "bg-[#FFC72C] text-[#121212] shadow-sm"
                      : "text-neutral-600 hover:text-[#121212]"
                  }`}
                >
                  {page.frequencyOnce}
                </button>
              </div>

              {/* Amount controls */}
              <div className="space-y-4 bg-white p-5 sm:p-6">
                <label className="block text-[11px] font-bold uppercase tracking-widest text-neutral-700">
                  {page.amountLabel}
                </label>

                <div className="grid grid-cols-2 gap-2.5">
                  {PRESET_AMOUNTS.map((presetVal) => {
                    const isSelected = !isCustom && amount === presetVal;
                    return (
                      <button
                        key={presetVal}
                        type="button"
                        onClick={() => handleSelectPreset(presetVal)}
                        className={`rounded-sm border px-3 py-3 text-sm font-bold transition-all duration-150 ${
                          isSelected
                            ? "border-[#FFC72C] bg-[#FFC72C] text-[#121212] shadow-sm"
                            : "border-transparent bg-[#EFECE6] text-neutral-800 hover:bg-[#E4DFD6]"
                        }`}
                      >
                        ${presetVal}{" "}
                        <span className="text-[10px] font-normal text-neutral-600">
                          {frequency === "monthly" ? page.presetSuffixMonthly : page.presetSuffixOnce}
                        </span>
                      </button>
                    );
                  })}
                </div>

                <div>
                  {!isCustom ? (
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className="w-full rounded-sm bg-[#EFECE6] py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 transition-colors hover:bg-[#E4DFD6]"
                    >
                      {page.customToggle}
                    </button>
                  ) : (
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-500">$</span>
                      <input
                        type="number"
                        autoFocus
                        placeholder={page.customPlaceholder}
                        value={customValue}
                        onChange={handleCustomInputChange}
                        className="w-full rounded-sm border-2 border-[#FFC72C] bg-[#EFECE6] py-2.5 pl-7 pr-12 text-sm font-bold text-[#121212] focus:outline-none"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-neutral-500">
                        {page.customCurrency}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex min-h-[38px] items-start gap-2 pt-2 text-xs font-medium leading-tight text-neutral-800">
                  <span className="text-base leading-none text-[#FFC72C]" aria-hidden="true">♡</span>
                  <p>{getImpactMessage()}</p>
                </div>

                {editor ? (
                  <div className="w-full rounded-sm bg-[#FFC72C] py-4 text-sm font-black uppercase tracking-widest text-[#121212] shadow-md">
                    <input aria-label="Hero button text" value={page.submitMonthly} onChange={(event) => editor.onChange("buttonText", event.target.value)} className="w-full border-0 bg-transparent text-center outline-none" />
                  </div>
                ) : (
                  <button
                    type="button"
                    disabled={amount < 5}
                    onClick={() => setPaymentModalOpen(true)}
                    className="block w-full rounded-sm bg-[#FFC72C] py-4 text-center text-sm font-black uppercase tracking-widest text-[#121212] shadow-md transition-all duration-150 hover:bg-[#E2AD17] active:scale-[0.99]"
                  >
                    {frequency === "monthly" ? page.submitMonthly : page.submitOnce}
                  </button>
                )}
              </div>

              {managedContent?.showSecureMessage !== false && (
                <div className="flex items-center justify-between border-t border-[#E5E0D8] bg-[#EFECE6]/70 px-5 py-2.5 text-[10px] font-medium text-neutral-600">
                  <span>🔒 {page.trustLeft}</span>
                  <span>{page.trustRight}</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      <DonationPaymentModal
        open={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        locale={locale}
        amount={amount}
        frequency={frequency}
      />

    </>
  );
}

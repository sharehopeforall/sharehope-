"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Heart, LockKeyhole, ShieldCheck } from "lucide-react";
import type { ManagedPageContent } from "@/lib/server/site-page";
import DonationPaymentModal from "@/components/public/DonationPaymentModal";

type Frequency = "monthly" | "once";

const PRESETS = [15, 30, 60, 120] as const;

const copy = {
  en: {
    eyebrow: "Make a difference today",
    title: "Your generosity builds brighter futures.",
    lead: "Every gift goes directly to the programs and communities that need it most. Choose an amount, pick a program, and see the impact you create.",
    formTitle: "Make your gift",
    formLead: "Choose the giving option that works best for you.",
    monthly: "Give monthly",
    once: "Give once",
    monthlyNote: "Most impactful",
    onceNote: "One-time gift",
    chooseAmount: "Choose your gift amount",
    customPlaceholder: "Enter a different amount",
    perMonth: "per month",
    oneTime: "one time",
    programLabel: "Direct my gift to",
    programs: {
      general: "Where it's needed most",
      education: "Education",
      health: "Health & Wellness",
      community: "Community Development",
      families: "Families in need",
      widows: "Widows in need",
    },
    impactTitle: "Your impact",
    impacts: {
      15: { monthly: "Provides durable aid for 2 families every year.", once: "Provides essential school supplies for 1 child." },
      30: { monthly: "Provides durable aid for 4 families every year.", once: "Provides water filtration for 2 households." },
      60: { monthly: "Provides durable aid for 8 families every year.", once: "Funds vocational training for a young adult." },
      120: { monthly: "Provides durable aid for 16 families every year.", once: "Sponsors school tuition for 4 students." },
    },
    impactCustom: "Your support helps communities thrive.",
    cta: "Donate now",
    choosePayment: "Choose a secure payment method",
    paymentLead: "How would you like to complete your donation?",
    stripe: "Credit or debit card",
    paypal: "PayPal",
    close: "Close",
    processing: "Opening secure checkout…",
    cancelled: "Checkout was cancelled. No payment was made.",
    paymentError: "We couldn't confirm that payment. Please try again or choose another payment method.",
    secure: "Secure checkout",
    encrypted: "Encrypted payment",
    trustTitle: "Why give with ShareHope?",
    trust: [
      { title: "Secure giving", body: "Your payment is processed through a protected, encrypted checkout." },
      { title: "Your choice matters", body: "Direct your gift to a program or let ShareHope apply it where it is needed most." },
      { title: "Local leadership", body: "Programs are designed and run by the communities they serve." },
    ],
    unavailable: "Online checkout is temporarily unavailable. Please contact us to arrange your gift.",
  },
  fr: {
    eyebrow: "Faites une différence aujourd'hui",
    title: "Votre générosité bâtit un avenir meilleur.",
    lead: "Chaque don va directement aux programmes et aux communautés qui en ont le plus besoin. Choisissez un montant, un programme, et voyez l'impact que vous créez.",
    formTitle: "Faites votre don",
    formLead: "Choisissez la formule de don qui vous convient.",
    monthly: "Don mensuel",
    once: "Don unique",
    monthlyNote: "Le plus porteur",
    onceNote: "Une seule fois",
    chooseAmount: "Choisissez le montant de votre don",
    customPlaceholder: "Entrer un autre montant",
    perMonth: "par mois",
    oneTime: "une seule fois",
    programLabel: "Diriger mon don vers",
    programs: {
      general: "Là où c'est le plus nécessaire",
      education: "Éducation",
      health: "Santé et bien-être",
      community: "Développement communautaire",
      families: "Familles dans le besoin",
      widows: "Veuves dans le besoin",
    },
    impactTitle: "Votre impact",
    impacts: {
      15: { monthly: "Offre une aide durable à 2 familles chaque année.", once: "Fournit le matériel scolaire essentiel à 1 enfant." },
      30: { monthly: "Offre une aide durable à 4 familles chaque année.", once: "Fournit la filtration d'eau à 2 foyers." },
      60: { monthly: "Offre une aide durable à 8 familles chaque année.", once: "Finance la formation professionnelle d'un jeune adulte." },
      120: { monthly: "Offre une aide durable à 16 familles chaque année.", once: "Parraine les frais de scolarité de 4 élèves." },
    },
    impactCustom: "Votre soutien aide les communautés à prospérer.",
    cta: "Faire un don",
    choosePayment: "Choisissez un mode de paiement sécurisé",
    paymentLead: "Comment souhaitez-vous effectuer votre don ?",
    stripe: "Carte de crédit ou de débit",
    paypal: "PayPal",
    close: "Fermer",
    processing: "Ouverture du paiement sécurisé…",
    cancelled: "Le paiement a été annulé. Aucun prélèvement n'a été effectué.",
    paymentError: "Nous n'avons pas pu confirmer ce paiement. Réessayez ou choisissez un autre mode de paiement.",
    secure: "Paiement sécurisé",
    encrypted: "Transaction chiffrée",
    trustTitle: "Pourquoi donner avec ShareHope ?",
    trust: [
      { title: "Don sécurisé", body: "Votre paiement est traité par une plateforme protégée et chiffrée." },
      { title: "Votre choix compte", body: "Dirigez votre don vers un programme ou confiez-le à ShareHope là où les besoins sont les plus grands." },
      { title: "Leadership local", body: "Les programmes sont conçus et menés par les communautés qu'ils servent." },
    ],
    unavailable: "Le paiement en ligne est temporairement indisponible. Contactez-nous pour organiser votre don.",
  },
} as const;

type ProgramKey = keyof (typeof copy)["en"]["programs"];
const PROGRAM_KEYS: ProgramKey[] = ["general", "education", "health", "community", "families", "widows"];

export default function DonateContent({ locale, managed }: { locale: string; managed?: ManagedPageContent | null }) {
  const base = locale === "fr" ? copy.fr : copy.en;
  const t = { ...base, title: managed?.title || base.title, eyebrow: managed?.subtitle || base.eyebrow, lead: managed?.body || base.lead, cta: managed?.buttonText || base.cta };
  const searchParams = useSearchParams();
  const initialProgram = (searchParams.get("program") ?? "general") as ProgramKey;
  const initialFrequency = searchParams.get("frequency") === "once" ? "once" : "monthly";
  const requestedAmount = Number(searchParams.get("amount"));
  const isPreset = PRESETS.includes(requestedAmount as (typeof PRESETS)[number]);
  const initialAmount = isPreset ? requestedAmount : 60;
  const initialCustom = !isPreset && Number.isFinite(requestedAmount) && requestedAmount >= 5 && requestedAmount <= 100_000 ? String(Math.round(requestedAmount)) : "";
  const [frequency, setFrequency] = useState<Frequency>(initialFrequency);
  const [amount, setAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState(initialCustom);
  const [program, setProgram] = useState<ProgramKey>(
    PROGRAM_KEYS.includes(initialProgram) ? initialProgram : "general",
  );
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const event = searchParams.get("event") ?? undefined;
  const cancelled = searchParams.get("cancelled") === "1";
  const paymentError = searchParams.get("payment_error") === "1";

  const effectiveAmount = customAmount ? Number(customAmount) : amount;
  const impact = customAmount
    ? t.impactCustom
    : (t.impacts[amount as keyof typeof t.impacts]?.[frequency] ?? t.impactCustom);

  return (
    <div className="bg-[#FAF7F2] text-[#121212]">
      {/* Hero + donation card */}
      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-16 lg:grid-cols-2 lg:py-24">
        <div className="space-y-5">
          <p className="font-mono-spaced text-xs font-bold uppercase text-[#64748B]">{t.eyebrow}</p>
          <h1 className="font-handwriting text-5xl font-bold leading-[0.95] text-[#121212] sm:text-6xl lg:text-7xl">
            {t.title}
          </h1>
          <p className="max-w-lg text-base leading-relaxed text-slate-700 sm:text-lg">{t.lead}</p>
        </div>

        <div className="relative mx-auto w-full max-w-lg overflow-hidden border border-slate-200 bg-white shadow-[0_20px_60px_rgba(15,42,68,.14)]">
          <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
            <h2 className="font-serif text-2xl font-semibold text-brand-navy">{t.formTitle}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">{t.formLead}</p>
          </div>

          {/* Frequency toggle */}
          <div className="grid grid-cols-2 gap-2 border-b border-slate-200 bg-slate-50 p-2">
            <button
              type="button"
              onClick={() => setFrequency("monthly")}
              aria-pressed={frequency === "monthly"}
              className={`flex min-h-16 flex-col items-center justify-center px-3 py-2 text-sm font-bold transition-all ${
                frequency === "monthly" ? "bg-brand-navy text-white shadow-sm" : "bg-white text-brand-navy hover:bg-blue-50"
              }`}
            >
              <span className="flex items-center gap-2"><Heart className="size-4" fill={frequency === "monthly" ? "currentColor" : "none"} />{t.monthly}</span>
              <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[.12em] ${frequency === "monthly" ? "text-white/65" : "text-slate-400"}`}>{t.monthlyNote}</span>
            </button>
            <button
              type="button"
              onClick={() => setFrequency("once")}
              aria-pressed={frequency === "once"}
              className={`flex min-h-16 flex-col items-center justify-center px-3 py-2 text-sm font-bold transition-all ${
                frequency === "once" ? "bg-brand-navy text-white shadow-sm" : "bg-white text-brand-navy hover:bg-blue-50"
              }`}
            >
              <span>{t.once}</span>
              <span className={`mt-1 text-[10px] font-semibold uppercase tracking-[.12em] ${frequency === "once" ? "text-white/65" : "text-slate-400"}`}>{t.onceNote}</span>
            </button>
          </div>

          <div className="space-y-5 p-5 sm:p-6">
            {(cancelled || paymentError) && (
              <p role="status" className="rounded border border-amber-200 bg-amber-50 p-3 text-sm font-medium text-amber-900">
                {paymentError ? t.paymentError : t.cancelled}
              </p>
            )}
            {/* Program selector */}
            <div>
              <label className="mb-2 block text-sm font-bold text-brand-navy">
                {t.programLabel}
              </label>
              <select
                value={program}
                onChange={(e) => setProgram(e.target.value as ProgramKey)}
                className="w-full border border-slate-300 bg-white px-4 py-3 text-sm text-brand-navy outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
              >
                {PROGRAM_KEYS.map((key) => (
                  <option key={key} value={key}>{t.programs[key]}</option>
                ))}
              </select>
            </div>

            {/* Amounts */}
            <label className="block text-sm font-bold text-brand-navy">
              {t.chooseAmount}
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              {PRESETS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => { setAmount(preset); setCustomAmount(""); }}
                  aria-pressed={!customAmount && amount === preset}
                  className={`min-h-[74px] border px-3 py-3 text-left transition-all ${
                    !customAmount && amount === preset
                      ? "border-brand-navy bg-blue-50 text-brand-navy ring-1 ring-brand-navy"
                      : "border-slate-200 bg-white text-brand-navy hover:border-slate-400"
                  }`}
                >
                  <span className="block font-serif text-2xl font-semibold">${preset}</span>
                  <span className="mt-1 block text-[11px] font-medium text-slate-500">{frequency === "monthly" ? t.perMonth : t.oneTime}</span>
                </button>
              ))}
            </div>
            <input
              type="number"
              min={5}
              step={1}
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={t.customPlaceholder}
              className="w-full border border-slate-300 bg-white px-4 py-3 text-base font-semibold text-brand-navy outline-none placeholder:font-normal focus:border-brand-navy focus:ring-1 focus:ring-brand-navy"
            />

            {/* Impact */}
            <div className="flex min-h-[70px] items-start gap-3 border-l-4 border-[#FFC72C] bg-[#F1F5FB] p-4 text-sm font-medium leading-6 text-brand-navy">
              <Heart className="mt-0.5 size-5 shrink-0 text-[#13306B]" />
              <div>
                <span className="font-bold">{t.impactTitle}: </span>
                {impact}
              </div>
            </div>

            {/* CTA */}
            <button
              type="button"
              disabled={effectiveAmount < 5}
              onClick={() => setPaymentModalOpen(true)}
              className="w-full bg-[#FFC72C] py-4 text-sm font-black uppercase tracking-[.12em] text-[#121212] shadow-md transition-all hover:bg-[#E2AD17] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.cta} — ${effectiveAmount || 0} →
            </button>
          </div>
          <div className="grid grid-cols-2 border-t border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600"><span className="flex items-center gap-2 border-r border-slate-200 px-4 py-3"><LockKeyhole className="size-4 text-brand-navy" />{t.secure}</span><span className="flex items-center justify-end gap-2 px-4 py-3 text-right"><ShieldCheck className="size-4 shrink-0 text-brand-navy" />{t.encrypted}</span></div>
        </div>
      </section>

      <DonationPaymentModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} locale={locale} amount={effectiveAmount} frequency={frequency} program={program} event={event} />

      {/* Trust section */}
      <section className="border-t border-[#E5E0D8] bg-white px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="font-serif text-center text-3xl font-bold text-[#121212] sm:text-4xl">{t.trustTitle}</h2>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {t.trust.map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#FFC72C]/20 text-[#121212]">
                  <ShieldCheck size={24} />
                </div>
                <h3 className="mt-5 font-serif text-xl font-semibold">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-[#64748B]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

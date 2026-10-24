"use client";

import { useState, type KeyboardEvent, type MouseEvent } from "react";
import Image from "next/image";
import { ArrowRight, BookOpenCheck, Building2, HandHeart, HeartHandshake, ImagePlus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import DonationPaymentModal from "@/components/public/DonationPaymentModal";

const copy = {
  en: {
    eyebrow: "Ready to Take Action?",
    title: "Choose how you want to make a difference.",
    body: "Explore the cards to find a meaningful way to support ShareHope.",
    actions: [
      { label: "Make a Donation", imageLabel: "Give", title: "Make an immediate difference.", button: "Donate Now", href: "/donate", image: "/images/hero-placeholders/child-learning.png", icon: HandHeart },
      { label: "Support a Program", imageLabel: "Programs", title: "Choose the work that matters to you.", button: "Explore Programs", href: "/programs", image: "/images/hero-placeholders/child-smiling.png", icon: BookOpenCheck },
      { label: "Volunteer Your Skills", imageLabel: "Volunteer", title: "Put your experience to work.", button: "Explore Volunteer Roles", href: "/volunteer", image: "/images/hero-placeholders/children-school.png", icon: HeartHandshake },
      { label: "Partner With ShareHope", imageLabel: "Partnerships", title: "Create impact together.", button: "Become a Partner", href: "/partner", image: "/images/hero-placeholders/clean-water.png", icon: Building2 },
    ],
  },
  fr: {
    eyebrow: "Prêt à passer à l'action ?",
    title: "Choisissez comment vous souhaitez faire une différence.",
    body: "Explorez les cartes pour trouver une façon significative de soutenir ShareHope.",
    actions: [
      { label: "Faire un don", imageLabel: "Don", title: "Faites une différence immédiate.", button: "Faire un don", href: "/donate", image: "/images/hero-placeholders/child-learning.png", icon: HandHeart },
      { label: "Soutenir un programme", imageLabel: "Programmes", title: "Choisissez la mission qui vous tient à cœur.", button: "Découvrir les programmes", href: "/programs", image: "/images/hero-placeholders/child-smiling.png", icon: BookOpenCheck },
      { label: "Offrir vos compétences", imageLabel: "Bénévolat", title: "Mettez votre expérience au service des autres.", button: "Voir les missions", href: "/volunteer", image: "/images/hero-placeholders/children-school.png", icon: HeartHandshake },
      { label: "Devenir partenaire", imageLabel: "Partenariats", title: "Créons un impact ensemble.", button: "Nous rejoindre", href: "/partner", image: "/images/hero-placeholders/clean-water.png", icon: Building2 },
    ],
  },
} as const;

interface ProgramsPreviewContent {
  eyebrow?: string | null;
  title?: string | null;
  body?: string | null;
  actionLabels?: string[] | null;
  actionImages?: string[] | null;
}

interface ProgramsPreviewEditor {
  onChange: (field: "eyebrow" | "title" | "body", value: string) => void;
  onActionLabelChange: (index: number, value: string) => void;
  onReplacePhoto: (index: number) => void;
}

export default function ProgramsPreviewSection({ locale, content: managedContent, editor }: { locale: string; content?: ProgramsPreviewContent; editor?: ProgramsPreviewEditor }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const fallback = locale === "fr" ? copy.fr : copy.en;
  const section = {
    ...fallback,
    eyebrow: managedContent?.eyebrow ?? fallback.eyebrow,
    title: managedContent?.title ?? fallback.title,
    body: managedContent?.body ?? fallback.body,
    actions: fallback.actions.map((action, index) => ({
      ...action,
      label: managedContent?.actionLabels?.[index] && !["Give Monthly", "Sponsor a Program", "Start a Fundraiser", "Volunteer With Us", "Become a Monthly Partner", "Don mensuel", "Parrainer un programme", "Lancer une collecte", "Devenir bénévole", "Devenir partenaire mensuel"].includes(managedContent.actionLabels[index])
        ? managedContent.actionLabels[index]
        : action.label,
      image: managedContent?.actionImages?.[index] || action.image,
    })),
  };

  const toggleCard = (index: number, event: MouseEvent<HTMLElement>) => {
    if ((event.target as HTMLElement).closest("a")) return;
    setOpenIndex((current) => (current === index ? null : index));
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLElement>) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setOpenIndex((current) => (current === index ? null : index));
  };

  return (
    <section id="take-action" className="scroll-mt-20 overflow-hidden border-t border-[#E5E0D8] bg-[#EFECE6]/50 py-20">
      <div className="mx-auto max-w-[820px] px-6 text-center">
        {editor ? <input aria-label="Eyebrow" value={section.eyebrow} onChange={(event) => editor.onChange("eyebrow", event.target.value)} className="w-full border-0 bg-transparent text-center font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600 outline-none focus:ring-2 focus:ring-[#FFC72C]/30" /> : <p className="font-mono-spaced text-xs font-bold uppercase tracking-[0.25em] text-neutral-600">{section.eyebrow}</p>}
        {editor ? <textarea aria-label="Heading" rows={2} value={section.title} onChange={(event) => editor.onChange("title", event.target.value)} className="mt-3 w-full resize-none border-0 bg-transparent text-center font-serif text-3xl tracking-tight text-[#121212] outline-none focus:ring-2 focus:ring-[#FFC72C]/30 sm:text-5xl" /> : <h2 className="mt-3 text-balance font-serif text-3xl tracking-tight text-[#121212] sm:text-5xl">{section.title}</h2>}
        {editor ? <textarea aria-label="Description" rows={2} value={section.body} onChange={(event) => editor.onChange("body", event.target.value)} className="mx-auto mt-3 block w-full max-w-[680px] resize-none border-0 bg-transparent text-center text-xs font-medium text-neutral-600 outline-none focus:ring-2 focus:ring-[#FFC72C]/30 sm:text-sm" /> : <p className="mx-auto mt-3 max-w-[680px] text-xs font-medium text-neutral-600 sm:text-sm">{section.body}</p>}
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {section.actions.map((action, index) => {
            const Icon = action.icon;
            const isOpen = openIndex === index;

            return (
              <article
                key={index}
                tabIndex={editor ? undefined : 0}
                aria-label={`${action.label}: ${action.title}`}
                onClick={editor ? undefined : (event) => toggleCard(index, event)}
                onKeyDown={editor ? undefined : (event) => handleKeyDown(index, event)}
                className="group relative rounded-sm border border-neutral-200 bg-white p-3.5 pb-5 shadow-xl outline-none transition duration-300 hover:-translate-y-2 hover:shadow-2xl focus-visible:ring-4 focus-visible:ring-[#FFC72C] focus-visible:ring-offset-4"
              >
                <div className={`absolute -top-3 z-20 h-5 w-16 border-x border-dashed border-[#B4AA96]/40 bg-[#F5F0E4]/85 shadow-sm ${index % 2 ? "right-8 rotate-6" : "left-8 -rotate-6"}`} aria-hidden="true" />
                <div className="relative mb-4 aspect-[3/4] overflow-hidden rounded-sm bg-neutral-900">
                <Image src={action.image} alt="" fill sizes="(min-width: 1024px) 25vw, 100vw" className="object-cover opacity-90 transition duration-500 group-hover:scale-105 group-hover:opacity-100" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212]/80 via-transparent to-transparent" aria-hidden="true" />
                {editor && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      editor.onReplacePhoto(index);
                    }}
                    className="absolute right-3 top-3 z-30 inline-flex items-center gap-2 rounded-lg bg-white/95 px-3 py-2 text-xs font-bold text-[#073B74] shadow-md transition hover:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange"
                  >
                    <ImagePlus size={16} aria-hidden="true" />
                    Change photo
                  </button>
                )}
                <div className="absolute inset-x-3 bottom-3 z-30 text-white">
                  <div className="flex items-center text-[12px] font-bold uppercase tracking-[0.14em] sm:text-[13px]">
                    <span className="mr-3 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-[#FFC72C] text-[#121212]"><Icon size={17} strokeWidth={2} aria-hidden="true" /></span>
                    {editor ? (
                      <input
                        aria-label={`Card ${index + 1} title`}
                        value={action.label}
                        onClick={(event) => event.stopPropagation()}
                        onKeyDown={(event) => event.stopPropagation()}
                        onChange={(event) => editor.onActionLabelChange(index, event.target.value)}
                        className="min-w-0 flex-1 rounded-sm border border-dashed border-white/70 bg-white/10 px-2 py-1 font-inherit uppercase tracking-[0.14em] text-white outline-none focus:border-white focus:bg-black/25 focus:ring-2 focus:ring-white"
                      />
                    ) : action.label}
                  </div>
                </div>
                </div>
                {!editor && (index === 0 ? (
                  <button type="button" onClick={(event) => { event.stopPropagation(); setPaymentModalOpen(true); }} className={`inline-flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-[#121212] transition-opacity ${isOpen ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}>{action.button}<ArrowRight size={16} aria-hidden="true" /></button>
                ) : (
                  <Link href={action.href} data-visual-editor-lock className={`inline-flex items-center gap-1.5 px-1 text-xs font-bold uppercase tracking-wider text-[#121212] transition-opacity ${isOpen ? "opacity-100" : "opacity-75 group-hover:opacity-100"}`}>{action.button}<ArrowRight size={16} aria-hidden="true" /></Link>
                ))}
              </article>
            );
          })}
        </div>
      </div>
      <DonationPaymentModal open={paymentModalOpen} onClose={() => setPaymentModalOpen(false)} locale={locale} amount={60} frequency="monthly" />
    </section>
  );
}

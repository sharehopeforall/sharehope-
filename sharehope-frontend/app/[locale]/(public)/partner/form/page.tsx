import type { Metadata } from "next";
import { Clock3, Mail, ShieldCheck } from "lucide-react";
import PartnerInquiryForm from "@/components/public/PartnerInquiryForm";
import { getManagedPage } from "@/lib/server/site-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "fr" ? "Demande de partenariat | ShareHope" : "Partnership inquiry | ShareHope", description: locale === "fr" ? "Présentez votre idée de partenariat à l’équipe ShareHope." : "Tell the ShareHope team about your partnership idea." };
}

export default async function PartnerFormPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const french = locale === "fr";
  const navigation = await getManagedPage("navigation-footer", locale);
  const contactEmail = typeof navigation?.settings.contactEmail === "string" && navigation.settings.contactEmail ? navigation.settings.contactEmail : "info@sharehopeforall.org";

  return <main className="bg-[#F8F6F0] text-slate-800">
    <section className="border-b border-slate-200 px-6 py-16 text-center sm:py-20"><div className="mx-auto max-w-3xl"><p className="font-space-mono text-xs font-bold uppercase tracking-[.22em] text-[#13306B]/70">{french ? "DEVENEZ PARTENAIRE" : "PARTNER WITH US"}</p><h1 className="mt-5 font-serif text-5xl font-semibold leading-tight tracking-[-.025em] text-brand-navy sm:text-6xl">{french ? "Commençons." : "Let’s get started."}</h1><p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600">{french ? "Parlez-nous de votre organisation, de vos objectifs et de l’impact que vous souhaitez créer. Notre équipe vous répondra avec les prochaines étapes." : "Tell us about your organization, your goals, and the impact you hope to create. Our team will follow up with the right next step."}</p></div></section>
    <section className="px-6 py-12 sm:py-16 lg:py-20"><div className="mx-auto grid max-w-6xl overflow-hidden border border-slate-200 bg-white shadow-[0_22px_70px_rgba(15,42,68,.08)] lg:grid-cols-[.72fr_1.28fr]">
      <aside className="bg-brand-navy px-7 py-10 text-white sm:px-10 lg:px-12 lg:py-14"><p className="text-xs font-bold uppercase tracking-[.2em] text-white/60">{french ? "À QUOI S’ATTENDRE" : "WHAT TO EXPECT"}</p><h2 className="mt-5 font-serif text-3xl font-semibold leading-tight">{french ? "Une première conversation utile et sans engagement." : "A useful first conversation, with no obligation."}</h2><p className="mt-5 leading-7 text-white/70">{french ? "Nous examinerons votre demande et vous mettrons en relation avec la bonne personne de notre équipe." : "We’ll review your inquiry and connect you with the right person on our team."}</p><div className="mt-10 space-y-7 border-t border-white/15 pt-8"><div className="flex gap-4"><Clock3 className="mt-1 size-5 shrink-0 text-[#A9C4F5]" /><div><p className="font-bold">{french ? "Réponse rapide" : "Thoughtful follow-up"}</p><p className="mt-1 text-sm leading-6 text-white/60">{french ? "Nous répondons habituellement sous deux jours ouvrables." : "We typically respond within two business days."}</p></div></div><div className="flex gap-4"><ShieldCheck className="mt-1 size-5 shrink-0 text-[#A9C4F5]" /><div><p className="font-bold">{french ? "Renseignements protégés" : "Information handled with care"}</p><p className="mt-1 text-sm leading-6 text-white/60">{french ? "Vos renseignements servent uniquement à répondre à cette demande." : "Your information is used only to respond to this inquiry."}</p></div></div><div className="flex gap-4"><Mail className="mt-1 size-5 shrink-0 text-[#A9C4F5]" /><div><p className="font-bold">{french ? "Vous préférez écrire?" : "Prefer email?"}</p><a href={`mailto:${contactEmail}`} className="mt-1 block break-all text-sm text-white/70 underline underline-offset-4">{contactEmail}</a></div></div></div></aside>
      <div className="px-6 py-10 sm:px-10 lg:px-14 lg:py-14"><PartnerInquiryForm locale={locale} contactEmail={contactEmail} /></div>
    </div></section>
  </main>;
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { getPublicEvent } from "@/lib/server/public-event";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getPublicEvent(locale, slug);
  return { title: event ? `${locale === "fr" ? "Faire un don" : "Donate"} — ${event.title} | ShareHope` : "Event not found | ShareHope" };
}

export default async function EventDonatePage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const event = await getPublicEvent(locale, slug);
  if (!event || !event.enableDonate) notFound();
  const isFrench = locale === "fr";

  return <main className="bg-[#FAF7F2] px-6 py-12 text-slate-800"><div className="mx-auto max-w-6xl"><Link href={`/events/${event.slug}`} className="text-sm font-bold text-brand-navy underline">← {isFrench ? "Retour à l’événement" : "Back to event"}</Link><div className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><section className="overflow-hidden border border-slate-200 bg-white"><div className="relative aspect-[16/9] bg-slate-100">{event.imageUrl && <Image src={event.imageUrl} alt={event.imageAlt} fill className="object-cover" sizes="(min-width:1024px) 45vw,100vw" />}</div><div className="space-y-4 p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-orange">{isFrench ? "Campagne de l’événement" : "Event campaign"}</p><h1 className="font-serif text-4xl font-bold text-brand-navy">{event.title}</h1><p className="leading-relaxed text-slate-600">{isFrench ? "Votre don sera associé à cet événement afin que l’équipe puisse mesurer son impact." : "Your gift will be associated with this event so the team can measure its impact."}</p></div></section><section className="border border-slate-200 bg-white p-7 shadow-sm"><h2 className="font-serif text-3xl font-bold text-brand-navy">{isFrench ? "Soutenir cet événement" : "Support this event"}</h2><p className="mt-3 leading-relaxed text-slate-600">{isFrench ? "Le traitement sécurisé des paiements sera disponible ici dès que le fournisseur de dons de ShareHope sera connecté. Vous pouvez continuer vers la page de don principale en attendant." : "Secure payment processing will appear here once ShareHope’s donation provider is connected. You can continue to the main giving page in the meantime."}</p><div className="mt-7 grid grid-cols-3 gap-3">{[25, 50, 100].map((amount) => <div key={amount} className="border border-slate-300 p-4 text-center text-xl font-bold text-brand-navy">${amount}</div>)}</div><Link href={`/donate?event=${encodeURIComponent(event.slug)}`} className="mt-7 block bg-brand-navy px-5 py-4 text-center text-sm font-bold uppercase tracking-widest text-white">{isFrench ? "Continuer vers la page de don" : "Continue to the donation page"}</Link></section></div></div></main>;
}

import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { EventVolunteerForm } from "@/components/public/EventVolunteerForm";
import { Link } from "@/i18n/navigation";
import { getPublicEvent } from "@/lib/server/public-event";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getPublicEvent(locale, slug);
  return { title: event ? `${locale === "fr" ? "Bénévolat" : "Volunteer"} — ${event.title} | ShareHope` : "Event not found | ShareHope" };
}

export default async function EventVolunteerPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const event = await getPublicEvent(locale, slug);
  if (!event || !event.enableVolunteer) notFound();
  const isFrench = locale === "fr";

  return <main className="bg-[#FAF7F2] px-6 py-12 text-slate-800"><div className="mx-auto max-w-6xl"><Link href={`/events/${event.slug}`} className="text-sm font-bold text-brand-navy underline">← {isFrench ? "Retour à l’événement" : "Back to event"}</Link><div className="mt-8 grid gap-10 lg:grid-cols-[.9fr_1.1fr]"><section className="overflow-hidden border border-slate-200 bg-white"><div className="relative aspect-[16/9] bg-slate-100">{event.imageUrl && <Image src={event.imageUrl} alt={event.imageAlt} fill className="object-cover" sizes="(min-width:1024px) 45vw,100vw" />}</div><div className="space-y-4 p-7"><p className="text-xs font-bold uppercase tracking-[.18em] text-brand-orange">{isFrench ? "Possibilité de bénévolat" : "Event volunteer opportunity"}</p><h1 className="font-serif text-4xl font-bold text-brand-navy">{event.title}</h1><p className="leading-relaxed text-slate-600">{isFrench ? "Contribuez directement à cet événement en choisissant l’un des rôles disponibles." : "Support this event directly by choosing one of its available volunteer roles."}</p><ul className="space-y-2 border-l-2 border-[#FFC72C] pl-5">{event.roles.map((role) => <li key={role}>{role}</li>)}</ul></div></section><EventVolunteerForm event={event} locale={locale} /></div></div></main>;
}

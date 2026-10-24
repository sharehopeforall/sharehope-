import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { EventDetail } from "@/components/public/EventDetail";
import { getPublicEvent } from "@/lib/server/public-event";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  const event = await getPublicEvent(locale, slug);
  return event ? { title: `${event.title} | ShareHope`, description: event.excerpt } : { title: "Event not found | ShareHope" };
}

export default async function EventPage({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  const event = await getPublicEvent(locale, slug);
  if (!event) notFound();
  return <EventDetail event={event} locale={locale} />;
}

import EventsContent from "@/components/public/EventsContent";
import type { Metadata } from "next";
import type { PublicEvent } from "@/types/event";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const french = locale === "fr";
  return {
    title: french ? "Événements | ShareHope" : "Events | ShareHope",
    description: french
      ? "Découvrez les prochains événements, rencontres et possibilités de bénévolat de ShareHope."
      : "Explore upcoming ShareHope events, gatherings, and volunteer opportunities.",
    alternates: {
      canonical: `/${locale}/events`,
      languages: { en: "/en/events", fr: "/fr/events" },
    },
  };
}

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let events: PublicEvent[] | undefined;
  try { const response = await fetchBackend(`${backendUrl}/api/public/events?locale=${encodeURIComponent(locale)}`, { cache: "no-store" }); if (response.ok) events = await response.json() as PublicEvent[]; } catch { /* Built-in fallback remains available. */ }

  return <EventsContent locale={locale} managedEvents={events} />;
}

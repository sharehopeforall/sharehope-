import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { EventRsvpForm } from "@/components/public/EventRsvpForm";
import type { PublicEvent } from "@/types/event";

export function EventDetail({ event, locale }: { event: PublicEvent; locale: string }) {
  const isFrench = locale === "fr";
  const date = new Intl.DateTimeFormat(isFrench ? "fr-CA" : "en-US", { dateStyle: "full", timeStyle: "short", timeZone: event.timezone }).format(new Date(event.startAt));

  return (
    <main className="bg-[#FAF7F2] text-[#1E293B]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <Link href="/events" className="text-sm font-bold text-brand-navy underline">← {isFrench ? "Tous les événements" : "All events"}</Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[1.35fr_.65fr]">
          <article className="overflow-hidden border border-[#E2E8F0] bg-white">
            <div className="relative aspect-[16/8] bg-slate-100">{event.imageUrl && <Image src={event.imageUrl} alt={event.imageAlt} fill sizes="(min-width:1024px) 65vw,100vw" className="object-cover" />}</div>
            <div className="space-y-6 p-6 md:p-10">
              <div className="flex flex-wrap gap-2"><span className="bg-brand-navy px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">{event.category}</span>{event.featured && <span className="bg-[#FFC72C] px-3 py-1 text-xs font-bold uppercase">{isFrench ? "À la une" : "Featured"}</span>}</div>
              <h1 className="font-serif text-4xl font-bold text-brand-navy md:text-5xl">{event.title}</h1>
              <div className="grid gap-4 border-y border-slate-200 py-5 sm:grid-cols-2">
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{isFrench ? "Date et heure" : "Date & time"}</p><p className="mt-1 font-semibold text-brand-navy">{date} ({event.timezone})</p></div>
                <div><p className="text-xs font-bold uppercase tracking-wider text-slate-500">{isFrench ? "Lieu" : "Location"}</p><p className="mt-1 font-semibold text-brand-navy">{event.location ?? (isFrench ? "En ligne" : "Online")}</p></div>
              </div>
              <p className="text-lg leading-relaxed text-slate-700">{event.description}</p>
              {event.agenda.length > 0 && <section><h2 className="font-serif text-2xl font-bold text-brand-navy">{isFrench ? "Programme" : "Schedule"}</h2><ul className="mt-3 space-y-2 border-l-2 border-[#FFC72C] pl-5 text-sm text-slate-700">{event.agenda.map((item) => <li key={item}>{item}</li>)}</ul></section>}
            </div>
          </article>
          <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
            {event.remainingSeats !== null && <p className={`border p-3 text-center text-sm font-bold ${event.soldOut ? "border-red-200 bg-red-50 text-red-800" : "border-emerald-200 bg-emerald-50 text-emerald-800"}`}>{event.soldOut ? (isFrench ? "Complet" : "Sold out") : isFrench ? `${event.remainingSeats} places restantes` : `${event.remainingSeats} spaces left`}</p>}
            {event.enableRsvp && <EventRsvpForm event={event} locale={locale} />}
            <div className="grid gap-3 sm:grid-cols-2">
              {event.enableDonate && <Link href={`/events/${event.slug}/donate`} className="border border-brand-navy px-4 py-3 text-center text-sm font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white">{isFrench ? "Soutenir cet événement" : "Donate to this event"}</Link>}
              {event.enableVolunteer && <Link href={`/events/${event.slug}/volunteer`} className="border border-brand-navy px-4 py-3 text-center text-sm font-bold text-brand-navy transition hover:bg-brand-navy hover:text-white">{isFrench ? "Bénévolat pour cet événement" : "Volunteer for this event"}</Link>}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

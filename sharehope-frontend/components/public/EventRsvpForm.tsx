"use client";

import { useRef, useState } from "react";
import { Link } from "@/i18n/navigation";
import type { PublicEvent } from "@/types/event";

export function EventRsvpForm({ event, locale }: { event: PublicEvent; locale: string }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [reference, setReference] = useState("");
  const successRef = useRef<HTMLDivElement>(null);
  const isFrench = locale === "fr";

  const start = new Date(event.startAt);
  const end = event.endAt ? new Date(event.endAt) : new Date(start.getTime() + 60 * 60 * 1000);
  const compact = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const dates = `${compact(start)}/${compact(end)}`;
  const googleCalendar = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.title)}&dates=${dates}&details=${encodeURIComponent(event.description)}&location=${encodeURIComponent(event.location ?? "Online")}`;
  const ics = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//ShareHope//Events//EN\r\nBEGIN:VEVENT\r\nUID:${event.slug}@sharehope.org\r\nDTSTAMP:${compact(new Date())}\r\nDTSTART:${compact(start)}\r\nDTEND:${compact(end)}\r\nSUMMARY:${event.title.replace(/,/g, "\\,")}\r\nLOCATION:${(event.location ?? "Online").replace(/,/g, "\\,")}\r\nDESCRIPTION:${event.description.replace(/\n/g, "\\n").replace(/,/g, "\\,")}\r\nEND:VEVENT\r\nEND:VCALENDAR`;

  const submit = async (formEvent: React.FormEvent<HTMLFormElement>) => {
    formEvent.preventDefault();
    const formElement = formEvent.currentTarget;
    const data = new FormData(formElement);
    setStatus("submitting");
    setError("");
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(event.slug)}/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ fullName: data.get("fullName"), email: data.get("email"), guestCount: Number(data.get("guestCount")), passType: data.get("passType"), locale: isFrench ? "fr" : "en" }) });
      const result = await response.json().catch(() => ({})) as { error?: string; registrationId?: string };
      if (!response.ok) throw new Error(result.error || (isFrench ? "Impossible de confirmer votre inscription." : "We could not confirm your RSVP."));
      setReference(result.registrationId?.slice(0, 8).toUpperCase() ?? "");
      setStatus("success");
      formElement.reset();
      requestAnimationFrame(() => successRef.current?.focus());
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : (isFrench ? "Impossible de confirmer votre inscription." : "We could not confirm your RSVP."));
      setStatus("error");
    }
  };

  if (event.soldOut) return <div className="border border-amber-200 bg-amber-50 p-6 text-center"><h2 className="font-serif text-2xl font-bold text-amber-950">{isFrench ? "Cet événement est complet" : "This event is sold out"}</h2><p className="mt-2 text-sm text-amber-900">{isFrench ? "Contactez notre équipe pour connaître les prochaines possibilités." : "Contact our team for future opportunities."}</p></div>;
  if (status === "success") return <div ref={successRef} tabIndex={-1} role="status" className="space-y-4 border border-emerald-200 bg-emerald-50 p-6 text-center outline-none"><h2 className="font-serif text-2xl font-bold text-emerald-950">{isFrench ? "RSVP confirmé" : "RSVP confirmed"}</h2><p className="text-sm text-emerald-900">{isFrench ? "Votre place a été réservée." : "Your place has been reserved."}{reference && <> {isFrench ? "Référence" : "Reference"}: <strong>{reference}</strong>.</>}</p><div className="flex flex-wrap justify-center gap-2"><a href={googleCalendar} target="_blank" rel="noreferrer" className="border border-emerald-800 px-4 py-2 text-sm font-bold text-emerald-950">Google Calendar</a><a href={`data:text/calendar;charset=utf-8,${encodeURIComponent(ics)}`} download={`${event.slug}.ics`} className="border border-emerald-800 px-4 py-2 text-sm font-bold text-emerald-950">{isFrench ? "Télécharger .ics" : "Download .ics"}</a></div></div>;

  const guestLimit = Math.min(10, event.remainingSeats ?? 10);
  return <form onSubmit={submit} className="space-y-5 border border-[#E2E8F0] bg-white p-6 shadow-sm"><div><h2 className="font-serif text-2xl font-bold text-brand-navy">{isFrench ? "Réserver votre place" : "Reserve your place"}</h2><p className="mt-1 text-sm text-slate-600">{isFrench ? "Votre confirmation apparaîtra ici après l’inscription." : "Your confirmation will appear here after registration."}</p></div><label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Type de billet" : "Pass type"}</span><select name="passType" required className="w-full border border-slate-300 bg-white px-3 py-3 font-normal"><option>{isFrench ? "Billet standard gratuit" : "Standard free pass"}</option><option>{isFrench ? "Billet invité donateur" : "Donor guest pass"}</option><option>{isFrench ? "Billet média et partenaire" : "Media and field partner pass"}</option></select></label><div className="grid gap-4 sm:grid-cols-[1fr_150px]"><label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Nom complet" : "Full name"}</span><input name="fullName" required maxLength={160} autoComplete="name" className="w-full border border-slate-300 px-3 py-3 font-normal" /></label><label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Total des participants" : "Total attendees"}</span><select name="guestCount" required className="w-full border border-slate-300 bg-white px-3 py-3 font-normal">{Array.from({ length: guestLimit }, (_, index) => index + 1).map((count) => <option key={count} value={count}>{count}</option>)}</select></label></div><label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Adresse courriel (facultatif)" : "Email address (optional)"}</span><input name="email" type="email" maxLength={320} autoComplete="email" className="w-full border border-slate-300 px-3 py-3 font-normal" /></label><p className="text-xs leading-relaxed text-slate-500">{isFrench ? "Ces renseignements servent uniquement à gérer cette inscription et ne vous abonnent pas aux communications marketing. " : "This information is used only to manage this registration and does not subscribe you to marketing. "}<Link href="/privacy" className="underline">{isFrench ? "Politique de confidentialité" : "Privacy policy"}</Link>.</p>{status === "error" && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{error}</p>}<button disabled={status === "submitting"} className="w-full bg-brand-navy px-5 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:cursor-wait disabled:opacity-60">{status === "submitting" ? (isFrench ? "Confirmation…" : "Confirming…") : (isFrench ? "Confirmer le RSVP" : "Confirm RSVP")}</button></form>;
}

"use client";

import { useState } from "react";
import { useEventDonations, useEventRegistrations, useUpdateRegistrationStatus } from "@/hooks/useEvents";
import type { AdminEvent, EventRegistration } from "@/types/event";

type AdminView = "RSVP" | "VOLUNTEER" | "DONATION";

export function EventRegistrationsPanel({ event, onClose }: { event: AdminEvent; onClose: () => void }) {
  const { data = [], isLoading, isError } = useEventRegistrations(event.id);
  const updateStatus = useUpdateRegistrationStatus(event.id);
  const donationsQuery = useEventDonations(event.id);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<AdminView>("RSVP");

  const active = data.filter((item) => item.status === "CONFIRMED" || item.status === "CHECKED_IN");
  const rsvps = data.filter((item) => item.registrationType === "RSVP");
  const volunteers = data.filter((item) => item.registrationType === "VOLUNTEER");
  const donations = donationsQuery.data ?? [];
  const current = view === "RSVP" ? rsvps : view === "VOLUNTEER" ? volunteers : [];
  const visible = current.filter((item) => `${item.fullName} ${item.email ?? ""} ${item.status}`.toLowerCase().includes(search.toLowerCase()));
  const reservedSeats = active.reduce((total, item) => total + item.guestCount, 0);

  const exportCsv = () => {
    const rows = [
      ["Type", "Name", "Email", "Pass / Role", "Guests", "Status", "Registered"],
      ...current.map((item) => [item.registrationType, item.fullName, item.email ?? "", item.passType, String(item.guestCount), item.status, item.createdAt]),
    ];
    const csv = rows.map((row) => row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.slug}-${view.toLowerCase()}s.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const counts: Record<AdminView, number> = {
    RSVP: rsvps.filter((item) => item.status === "CONFIRMED" || item.status === "CHECKED_IN").length,
    VOLUNTEER: volunteers.filter((item) => item.status === "CONFIRMED" || item.status === "CHECKED_IN").length,
    DONATION: donations.filter((item) => item.status.toLowerCase() === "succeeded").length,
  };

  return (
    <section className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <div className="flex flex-wrap items-center gap-3 border-b px-5 py-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-navy">Event activity — {event.en.title}</h2>
          <p className="text-sm text-slate-500">{active.length} active people · {reservedSeats}{event.capacity ? ` / ${event.capacity}` : ""} reserved seats</p>
        </div>
        <div className="ml-auto flex gap-2">
          {view !== "DONATION" && <button type="button" onClick={exportCsv} disabled={!current.length} className="rounded border border-brand-navy px-4 py-2 text-brand-navy disabled:opacity-40">Export {view === "RSVP" ? "RSVPs" : "volunteers"}</button>}
          <button type="button" onClick={onClose} className="rounded border px-4 py-2">Close</button>
        </div>
      </div>

      <div className="grid grid-cols-3 border-b bg-slate-50" role="tablist" aria-label="Event activity type">
        {(["RSVP", "VOLUNTEER", "DONATION"] as AdminView[]).map((item) => (
          <button key={item} type="button" role="tab" aria-selected={view === item} onClick={() => { setView(item); setSearch(""); }} className={`px-4 py-4 text-sm font-bold ${view === item ? "border-b-2 border-brand-navy bg-white text-brand-navy" : "text-slate-500"}`}>
            {item === "RSVP" ? "RSVPs" : item === "VOLUNTEER" ? "Volunteers" : "Donations"} <span className="ml-1 rounded-full bg-slate-200 px-2 py-0.5 text-xs">{counts[item]}</span>
          </button>
        ))}
      </div>

      {view === "DONATION" ? (
        <div className="p-8 text-center">
          {donationsQuery.isLoading ? <p className="text-sm text-slate-500">Loading donations…</p> : donationsQuery.isError ? <p className="text-sm font-semibold text-red-700">Event donations could not be loaded.</p> : donations.length === 0 ? <><h3 className="font-serif text-xl font-bold text-brand-navy">No completed event donations</h3><p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Donations made through this event’s campaign will appear here after Stripe or PayPal confirms payment.</p></> : <div className="overflow-x-auto text-left"><table className="w-full min-w-[700px] text-sm"><thead><tr className="border-b text-xs uppercase text-slate-500"><th className="py-2">Donor</th><th>Amount</th><th>Frequency</th><th>Provider</th><th>Status</th><th>Date</th></tr></thead><tbody>{donations.map((donation)=><tr key={donation.id} className="border-b"><td className="py-3"><strong>{donation.donorName||"Anonymous"}</strong><br/><span className="text-xs text-slate-500">{donation.donorEmail||"No email"}</span></td><td>{new Intl.NumberFormat("en-US",{style:"currency",currency:donation.currency}).format(donation.amountCents/100)}</td><td>{donation.frequency}</td><td>{donation.provider}</td><td>{donation.status}</td><td>{new Date(donation.createdAt).toLocaleDateString()}</td></tr>)}</tbody></table></div>}
        </div>
      ) : (
        <>
          {current.length > 0 && <div className="border-b p-4"><label className="text-sm font-medium">Search {view === "RSVP" ? "RSVPs" : "volunteers"} <input value={search} onChange={(changeEvent) => setSearch(changeEvent.target.value)} placeholder="Name, email, or status" className="ml-2 rounded border px-3 py-2 font-normal" /></label></div>}
          {updateStatus.isError && <p className="border-b border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">The registration status could not be updated. Refresh and try again.</p>}
          {isLoading ? <p className="p-5 text-sm text-slate-500">Loading registrations…</p> : isError ? <p className="p-5 text-sm text-destructive">Registrations could not be loaded.</p> : current.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No {view === "RSVP" ? "RSVPs" : "volunteers"} yet.</p> : <RegistrationTable registrations={visible} pending={updateStatus.isPending} updateStatus={(registrationId, status) => updateStatus.mutate({ registrationId, status })} />}
        </>
      )}
    </section>
  );
}

function RegistrationTable({ registrations, updateStatus, pending }: { registrations: EventRegistration[]; pending:boolean; updateStatus: (id: string, status: "CONFIRMED"|"CHECKED_IN"|"CANCELLED") => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Pass / Role</th><th className="px-5 py-3">Guests</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y">{registrations.map((item) => <tr key={item.id} className={item.status === "CANCELLED" ? "opacity-50" : ""}><td className="px-5 py-3 font-medium">{item.fullName}</td><td className="px-5 py-3">{item.email ? <a href={`mailto:${item.email}`} className="text-brand-navy underline">{item.email}</a> : <span className="text-slate-400">Not provided</span>}</td><td className="px-5 py-3">{item.passType.replace(/^Volunteer — /, "")}</td><td className="px-5 py-3">{item.guestCount}</td><td className="px-5 py-3 font-semibold">{item.status.replaceAll("_", " ")}</td><td className="px-5 py-3"><div className="flex gap-2">{item.status === "PENDING_CONFIRMATION" ? <span className="text-xs text-amber-700">Awaiting email verification</span> : <>{item.status !== "CHECKED_IN" && item.status !== "CANCELLED" && <button disabled={pending} onClick={() => updateStatus(item.id, "CHECKED_IN")} className="rounded bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-50">Check in</button>}{item.status === "CHECKED_IN" && <button disabled={pending} onClick={() => updateStatus(item.id, "CONFIRMED")} className="rounded border px-3 py-1.5 text-xs disabled:opacity-50">Undo check-in</button>}{item.status !== "CANCELLED" ? <button disabled={pending} onClick={() => updateStatus(item.id, "CANCELLED")} className="rounded border px-3 py-1.5 text-xs text-destructive disabled:opacity-50">Cancel</button> : <button disabled={pending} onClick={() => updateStatus(item.id, "CONFIRMED")} className="rounded border px-3 py-1.5 text-xs disabled:opacity-50">Restore</button>}</>}</div></td></tr>)}</tbody></table>{registrations.length === 0 && <p className="p-5 text-sm text-slate-500">No matching registrations.</p>}</div>;
}

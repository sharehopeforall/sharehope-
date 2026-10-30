"use client";

import { useState } from "react";
import { useEventRegistrations, useUpdateRegistrationStatus } from "@/hooks/useEvents";
import type { AdminEvent, EventRegistration } from "@/types/event";

type AdminView = "RSVP" | "VOLUNTEER" | "DONATION";

export function EventRegistrationsPanel({ event, onClose }: { event: AdminEvent; onClose: () => void }) {
  const { data = [], isLoading, isError } = useEventRegistrations(event.id);
  const updateStatus = useUpdateRegistrationStatus(event.id);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<AdminView>("RSVP");

  const active = data.filter((item) => item.status !== "CANCELLED");
  const rsvps = data.filter((item) => item.registrationType === "RSVP");
  const volunteers = data.filter((item) => item.registrationType === "VOLUNTEER");
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
    RSVP: rsvps.filter((item) => item.status !== "CANCELLED").length,
    VOLUNTEER: volunteers.filter((item) => item.status !== "CANCELLED").length,
    DONATION: 0,
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
          <h3 className="font-serif text-xl font-bold text-brand-navy">No completed event donations</h3>
          <p className="mx-auto mt-2 max-w-xl text-sm text-slate-500">Donation records will appear here after a payment provider is connected and confirms successful payments. Selecting an amount on the public page is not counted as a donation.</p>
        </div>
      ) : (
        <>
          {current.length > 0 && <div className="border-b p-4"><label className="text-sm font-medium">Search {view === "RSVP" ? "RSVPs" : "volunteers"} <input value={search} onChange={(changeEvent) => setSearch(changeEvent.target.value)} placeholder="Name, email, or status" className="ml-2 rounded border px-3 py-2 font-normal" /></label></div>}
          {isLoading ? <p className="p-5 text-sm text-slate-500">Loading registrations…</p> : isError ? <p className="p-5 text-sm text-destructive">Registrations could not be loaded.</p> : current.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No {view === "RSVP" ? "RSVPs" : "volunteers"} yet.</p> : <RegistrationTable registrations={visible} updateStatus={(registrationId, status) => updateStatus.mutate({ registrationId, status })} />}
        </>
      )}
    </section>
  );
}

function RegistrationTable({ registrations, updateStatus }: { registrations: EventRegistration[]; updateStatus: (id: string, status: EventRegistration["status"]) => void }) {
  return <div className="overflow-x-auto"><table className="w-full min-w-[920px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="px-5 py-3">Name</th><th className="px-5 py-3">Email</th><th className="px-5 py-3">Pass / Role</th><th className="px-5 py-3">Guests</th><th className="px-5 py-3">Status</th><th className="px-5 py-3">Actions</th></tr></thead><tbody className="divide-y">{registrations.map((item) => <tr key={item.id} className={item.status === "CANCELLED" ? "opacity-50" : ""}><td className="px-5 py-3 font-medium">{item.fullName}</td><td className="px-5 py-3">{item.email ? <a href={`mailto:${item.email}`} className="text-brand-navy underline">{item.email}</a> : <span className="text-slate-400">Not provided</span>}</td><td className="px-5 py-3">{item.passType.replace(/^Volunteer — /, "")}</td><td className="px-5 py-3">{item.guestCount}</td><td className="px-5 py-3 font-semibold">{item.status.replace("_", " ")}</td><td className="px-5 py-3"><div className="flex gap-2">{item.status !== "CHECKED_IN" && item.status !== "CANCELLED" && <button onClick={() => updateStatus(item.id, "CHECKED_IN")} className="rounded bg-blue-700 px-3 py-1.5 text-xs font-semibold text-white">Check in</button>}{item.status === "CHECKED_IN" && <button onClick={() => updateStatus(item.id, "CONFIRMED")} className="rounded border px-3 py-1.5 text-xs">Undo check-in</button>}{item.status !== "CANCELLED" ? <button onClick={() => updateStatus(item.id, "CANCELLED")} className="rounded border px-3 py-1.5 text-xs text-destructive">Cancel</button> : <button onClick={() => updateStatus(item.id, "CONFIRMED")} className="rounded border px-3 py-1.5 text-xs">Restore</button>}</div></td></tr>)}</tbody></table>{registrations.length === 0 && <p className="p-5 text-sm text-slate-500">No matching registrations.</p>}</div>;
}

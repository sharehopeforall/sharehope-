"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { CalendarCheck, Eye, LayoutTemplate, List, Plus, Search, TicketCheck } from "lucide-react";
import { EventRegistrationsPanel } from "@/components/admin/EventRegistrationsPanel";
import EventsContent from "@/components/public/EventsContent";
import { useAdminEvents, useCreateEvent, useDeleteEvent, useUpdateEvent } from "@/hooks/useEvents";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import type { AdminEvent, EventInput, EventTranslation, PublicEvent } from "@/types/event";

const blankContent = (): EventTranslation => ({ title: "New Event", excerpt: "", description: "", buttonText: "View event", imageAlt: "", metaTag: "", agenda: [""], roles: [""] });
const field = "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10";

function EventEditor({ event, order, onSave, onCancel, busy }: { event?: AdminEvent; order: number; onSave: (value: EventInput) => void; onCancel: () => void; busy: boolean }) {
  const [slug, setSlug] = useState(event?.slug ?? "new-event");
  const [category, setCategory] = useState<EventInput["category"]>(event?.category ?? "in-person");
  const [startAt, setStartAt] = useState((event?.startAt ?? new Date().toISOString()).slice(0, 16));
  const [endAt, setEndAt] = useState(event?.endAt?.slice(0, 16) ?? "");
  const [timezone, setTimezone] = useState(event?.timezone ?? "America/Los_Angeles");
  const [location, setLocation] = useState(event?.location ?? "");
  const [virtualUrl, setVirtualUrl] = useState(event?.virtualUrl ?? "");
  const [status, setStatus] = useState<EventInput["status"]>(event?.status ?? "DRAFT");
  const [featured, setFeatured] = useState(event?.featured ?? false);
  const [capacity, setCapacity] = useState(event?.capacity?.toString() ?? "");
  const [imageUrl, setImageUrl] = useState(event?.imageUrl ?? "/images/hero-placeholders/children-school.png");
  const [content, setContent] = useState(event?.en ?? blankContent());
  const [enableRsvp, setEnableRsvp] = useState(event?.enableRsvp ?? true);
  const [enableDonate, setEnableDonate] = useState(event?.enableDonate ?? true);
  const [enableVolunteer, setEnableVolunteer] = useState(event?.enableVolunteer ?? true);
  const file = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();
  const patchContent = (value: Partial<EventTranslation>) => setContent((current) => ({ ...current, ...value }));
  const hasAction = enableRsvp || enableDonate || enableVolunteer;

  return (
    <form onSubmit={(submitEvent) => { submitEvent.preventDefault(); if (!hasAction) return; onSave({ slug, category, startAt: new Date(startAt).toISOString(), endAt: endAt ? new Date(endAt).toISOString() : null, timezone, location: location || null, virtualUrl: virtualUrl || null, imageUrl, displayOrder: event?.displayOrder ?? order, status, featured, highlighted: false, capacity: capacity ? Number(capacity) : null, enableRsvp, enableDonate, enableVolunteer, en: content, fr: content }); }} className="overflow-hidden rounded-2xl border bg-white shadow-sm">
      <header className="flex flex-wrap items-center gap-3 border-b bg-slate-50 px-6 py-4">
        <div><h2 className="font-serif text-2xl font-bold text-brand-navy">{event ? "Edit event" : "Create event"}</h2><p className="text-sm text-slate-500">One-language editor · translations can be added later</p></div>
        <select value={status} onChange={(changeEvent) => setStatus(changeEvent.target.value as EventInput["status"])} className="ml-auto rounded-lg border px-3 py-2 text-sm"><option>DRAFT</option><option>PUBLISHED</option><option>CANCELLED</option><option>ARCHIVED</option></select>
      </header>

      <div className="grid gap-8 p-6 xl:grid-cols-[340px_1fr]">
        <aside className="space-y-6">
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-navy">Event image</h3>
            <input ref={file} type="file" accept="image/*" className="hidden" onChange={(changeEvent) => { const selected = changeEvent.target.files?.[0]; changeEvent.target.value = ""; if (selected) upload.mutate(selected, { onSuccess: (result) => setImageUrl(result.url) }); }} />
            <button type="button" onClick={() => file.current?.click()} className="relative mt-3 aspect-[4/3] w-full overflow-hidden rounded-xl bg-slate-100"><Image src={imageUrl} alt="Event preview" fill className="object-cover" /><span className="absolute inset-x-0 bottom-0 bg-black/65 p-2 text-sm font-semibold text-white">{upload.isPending ? "Uploading…" : "Replace image"}</span></button>
            <label className="mt-3 block text-sm font-medium">Image description<input value={content.imageAlt} onChange={(changeEvent) => patchContent({ imageAlt: changeEvent.target.value })} className={field} /></label>
          </section>

          <section className="rounded-xl border border-brand-navy/15 bg-brand-navy/[.03] p-4">
            <h3 className="font-bold text-brand-navy">Visitor actions</h3><p className="mt-1 text-xs text-slate-500">Choose one, two, or all three. Only selected actions appear publicly.</p>
            <div className="mt-4 space-y-3">
              {[["RSVP", enableRsvp, setEnableRsvp], ["Donate", enableDonate, setEnableDonate], ["Volunteer", enableVolunteer, setEnableVolunteer]].map(([label, checked, setter]) => <label key={String(label)} className="flex cursor-pointer items-center gap-3 rounded-lg border bg-white p-3 text-sm font-semibold"><input type="checkbox" checked={Boolean(checked)} onChange={(changeEvent) => (setter as (value: boolean) => void)(changeEvent.target.checked)} className="size-4" /><span>{String(label)}</span></label>)}
            </div>
            {!hasAction && <p className="mt-3 text-xs font-semibold text-red-700">Select at least one action.</p>}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-bold uppercase tracking-wider text-brand-navy">Publishing</h3>
            <label className="block text-sm font-medium">URL slug<input value={slug} onChange={(changeEvent) => setSlug(changeEvent.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} className={field} /></label>
            <label className="flex items-center gap-2 text-sm font-medium"><input type="checkbox" checked={featured} onChange={(changeEvent) => setFeatured(changeEvent.target.checked)} /> Feature this event</label>
          </section>
        </aside>

        <div className="space-y-8">
          <section className="space-y-4">
            <div><p className="text-xs font-bold uppercase tracking-[.18em] text-slate-500">Content</p><h3 className="font-serif text-2xl font-bold text-brand-navy">Event details</h3></div>
            <label className="block text-sm font-medium">Event label<input value={content.metaTag} onChange={(changeEvent) => patchContent({ metaTag: changeEvent.target.value })} placeholder="GALA • NEW YORK" className={field} /></label>
            <label className="block text-sm font-medium">Event title<input value={content.title} onChange={(changeEvent) => patchContent({ title: changeEvent.target.value })} className={`${field} font-serif text-2xl font-bold text-brand-navy`} /></label>
            <label className="block text-sm font-medium">Short summary<textarea rows={2} value={content.excerpt} onChange={(changeEvent) => patchContent({ excerpt: changeEvent.target.value })} className={field} /></label>
            <label className="block text-sm font-medium">Full description<textarea rows={5} value={content.description} onChange={(changeEvent) => patchContent({ description: changeEvent.target.value })} className={field} /></label>
          </section>

          <section className="grid gap-4 rounded-xl border p-5 md:grid-cols-2">
            <div className="md:col-span-2"><h3 className="font-serif text-xl font-bold text-brand-navy">Schedule and location</h3></div>
            <label className="text-sm font-medium">Event type<select value={category} onChange={(changeEvent) => setCategory(changeEvent.target.value as EventInput["category"])} className={field}><option value="in-person">In person</option><option value="virtual">Virtual</option><option value="hybrid">Hybrid</option></select></label>
            <label className="text-sm font-medium">Timezone<input value={timezone} onChange={(changeEvent) => setTimezone(changeEvent.target.value)} className={field} /></label>
            <label className="text-sm font-medium">Starts<input type="datetime-local" value={startAt} onChange={(changeEvent) => setStartAt(changeEvent.target.value)} className={field} /></label>
            <label className="text-sm font-medium">Ends<input type="datetime-local" value={endAt} onChange={(changeEvent) => setEndAt(changeEvent.target.value)} className={field} /></label>
            <label className="text-sm font-medium md:col-span-2">Location<input value={location} onChange={(changeEvent) => setLocation(changeEvent.target.value)} className={field} /></label>
            {category !== "in-person" && <label className="text-sm font-medium md:col-span-2">Virtual meeting URL<input value={virtualUrl} onChange={(changeEvent) => setVirtualUrl(changeEvent.target.value)} className={field} /></label>}
          </section>

          {(enableRsvp || enableVolunteer) && <section className="grid gap-4 rounded-xl border p-5 md:grid-cols-2"><div className="md:col-span-2"><h3 className="font-serif text-xl font-bold text-brand-navy">Registration setup</h3></div>{enableRsvp && <label className="text-sm font-medium">Capacity <span className="font-normal text-slate-500">(blank for unlimited)</span><input type="number" min="1" value={capacity} onChange={(changeEvent) => setCapacity(changeEvent.target.value)} className={field} /></label>}<label className="text-sm font-medium md:col-span-2">Agenda <span className="font-normal text-slate-500">(one item per line)</span><textarea value={content.agenda.join("\n")} onChange={(changeEvent) => patchContent({ agenda: changeEvent.target.value.split("\n") })} rows={4} className={field} /></label>{enableVolunteer && <label className="text-sm font-medium md:col-span-2">Volunteer roles <span className="font-normal text-slate-500">(one role per line)</span><textarea value={content.roles.join("\n")} onChange={(changeEvent) => patchContent({ roles: changeEvent.target.value.split("\n") })} rows={4} className={field} /></label>}</section>}
        </div>
      </div>

      <footer className="sticky bottom-0 flex justify-end gap-3 border-t bg-white/95 px-6 py-4 backdrop-blur"><button type="button" onClick={onCancel} className="rounded-lg border px-5 py-2.5">Cancel</button><button disabled={busy || upload.isPending || !hasAction || !content.title.trim() || !content.excerpt.trim() || !content.description.trim()} className="rounded-lg bg-brand-navy px-6 py-2.5 font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Save event"}</button></footer>
    </form>
  );
}

export function EventsAdminClient() {
  const searchParams = useSearchParams();
  const { data = [], isLoading, isError } = useAdminEvents();
  const create = useCreateEvent(); const update = useUpdateEvent(); const remove = useDeleteEvent();
  const [editing, setEditing] = useState<AdminEvent | "new" | null>(() => searchParams.get("new") === "1" ? "new" : null);
  const [activityEvent, setActivityEvent] = useState<AdminEvent | null>(null);
  const [view, setView] = useState<"layout" | "library">("layout");
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | AdminEvent["status"]>("ALL");
  const save = (value: EventInput) => editing === "new" ? create.mutate(value, { onSuccess: () => setEditing(null) }) : editing && update.mutate({ id: editing.id, data: value }, { onSuccess: () => setEditing(null) });

  const previewEvents = useMemo<PublicEvent[]>(() => data
    .filter((event) => includeDrafts ? event.status !== "ARCHIVED" : event.status === "PUBLISHED")
    .sort((a, b) => a.displayOrder - b.displayOrder || new Date(a.startAt).getTime() - new Date(b.startAt).getTime())
    .map((event) => {
      const remainingSeats = event.capacity === null ? null : Math.max(0, event.capacity - event.reservedSeats);
      return { id: event.id, slug: event.slug, category: event.category, startAt: event.startAt, endAt: event.endAt, timezone: event.timezone, location: event.location, imageUrl: event.imageUrl, displayOrder: event.displayOrder, featured: event.featured, highlighted: event.highlighted, capacity: event.capacity, reservedSeats: event.reservedSeats, remainingSeats, soldOut: remainingSeats === 0, enableRsvp: event.enableRsvp, enableDonate: event.enableDonate, enableVolunteer: event.enableVolunteer, ...event.en };
    }), [data, includeDrafts]);

  const filtered = useMemo(() => data.filter((event) => {
    const matchesStatus = filter === "ALL" || event.status === filter;
    const haystack = `${event.en.title} ${event.category} ${event.location ?? ""}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [data, filter, query]);

  if (isLoading) return <p className="p-6">Loading events…</p>;
  if (isError) return <p className="p-6 text-destructive">Events could not be loaded.</p>;
  return <div className="space-y-6 p-6 lg:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-green">Event publishing</p><h1 className="mt-1 font-serif text-4xl font-bold text-brand-navy">Events</h1><p className="mt-1 text-sm text-slate-500">Build the public events page and manage registrations in one place.</p></div>
      <div className="flex flex-wrap gap-2"><div className="flex rounded-lg border bg-slate-100 p-1"><button onClick={() => setView("layout")} className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${view === "layout" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}><LayoutTemplate className="size-4" />Visual layout</button><button onClick={() => setView("library")} className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${view === "library" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}><List className="size-4" />Event library</button></div><button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white"><Plus className="size-4" />New event</button></div>
    </div>

    {editing && <EventEditor key={editing === "new" ? "new" : editing.id} event={editing === "new" ? undefined : editing} order={data.length + 1} onSave={save} onCancel={() => setEditing(null)} busy={create.isPending || update.isPending} />}
    {activityEvent && <EventRegistrationsPanel event={activityEvent} onClose={() => setActivityEvent(null)} />}
    {(create.isError || update.isError || remove.isError) && <p className="rounded border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">The event could not be saved. Check the required fields, dates, URL, and selected visitor actions.</p>}

    {!editing && view === "layout" && <div className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-5 py-3"><div><p className="text-sm font-bold text-brand-navy">Public website layout</p><p className="text-xs text-slate-500">Click an event card to edit its content, schedule, image, and visitor actions.</p></div><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={includeDrafts} onChange={(event) => setIncludeDrafts(event.target.checked)} /> Preview drafts</label><a href="/en/events" target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-green">Open public page ↗</a></div></div><EventsContent locale="en" managedEvents={previewEvents} editor={{ onEditEvent: (slug) => { const event = data.find((item) => item.slug === slug); if (event) setEditing(event); }, onCreateEvent: () => setEditing("new") }} /></div>}

    {!editing && view === "library" && <>
      <section className="grid gap-3 sm:grid-cols-3">{[
        { label: "All events", value: data.length, icon: CalendarCheck },
        { label: "Published", value: data.filter((event) => event.status === "PUBLISHED").length, icon: Eye },
        { label: "Reserved seats", value: data.reduce((sum, event) => sum + event.reservedSeats, 0), icon: TicketCheck },
      ].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 rounded-xl border bg-white p-4"><span className="rounded-lg bg-brand-cream p-3 text-brand-navy"><Icon className="size-5" /></span><span><strong className="block text-2xl text-brand-navy">{value}</strong><small className="text-slate-500">{label}</small></span></div>)}</section>
      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-3"><label className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, type, or location" className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-navy" /></label><div className="flex flex-wrap rounded-lg bg-slate-100 p-1">{(["ALL", "PUBLISHED", "DRAFT", "CANCELLED", "ARCHIVED"] as const).map((status) => <button key={status} onClick={() => setFilter(status)} className={`rounded-md px-3 py-2 text-xs font-bold ${filter === status ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}>{status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}</button>)}</div></div>
      {filtered.length === 0 ? <div className="rounded-xl border bg-white p-12 text-center text-sm text-slate-500">No events match these filters.</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((event) => <article key={event.id} className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="relative aspect-[16/9] bg-slate-100">{event.imageUrl && <Image src={event.imageUrl} alt={event.en.imageAlt || ""} fill className="object-cover" sizes="(min-width:1280px) 30vw, (min-width:768px) 45vw, 100vw" />}<span className="absolute right-3 top-3 rounded-full bg-white px-3 py-1 text-xs font-bold shadow-sm">{event.status}</span></div><div className="space-y-3 p-5"><p className="text-xs font-bold uppercase text-slate-500">{new Intl.DateTimeFormat("en-US", { dateStyle: "medium", timeStyle: "short", timeZone: event.timezone }).format(new Date(event.startAt))}</p><h2 className="font-serif text-2xl font-bold text-brand-navy">{event.en.title}</h2><p className="text-sm text-slate-600">{event.location || (event.category === "virtual" ? "Online" : "Location not set")}</p><div className="flex flex-wrap gap-1.5">{event.enableRsvp && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">RSVP</span>}{event.enableDonate && <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">Donate</span>}{event.enableVolunteer && <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-800">Volunteer</span>}</div><p className="text-xs font-medium text-slate-500">{event.reservedSeats} reserved {event.capacity !== null ? `of ${event.capacity}` : "· unlimited capacity"}</p><div className="flex flex-wrap gap-2 pt-1"><button onClick={() => setEditing(event)} className="rounded bg-brand-navy px-4 py-2 text-sm font-semibold text-white">Edit</button><button onClick={() => setActivityEvent(event)} className="rounded border border-brand-navy px-4 py-2 text-sm font-semibold text-brand-navy">Registrations</button><button onClick={() => { if (window.confirm(`Delete ${event.en.title}?`)) remove.mutate(event.id); }} className="rounded border px-4 py-2 text-sm font-semibold text-red-700">Delete</button></div></div></article>)}</div>}
    </>}
  </div>;
}

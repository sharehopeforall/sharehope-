"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { BriefcaseBusiness, CalendarDays, ImagePlus, MapPin, Pencil, Plus, Search, Trash2, UserRound, UsersRound, X } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useCurrentUser } from "@/hooks/useAuth";
import { useCreateTeamMember, useDeleteTeamMember, useTeamMembers, useUpdateTeamMember } from "@/hooks/useTeam";
import { uploadFile } from "@/lib/blob/upload";
import type { TeamMember, TeamMemberInput, TeamMemberStatus } from "@/types/team";

const statuses: { value: TeamMemberStatus; label: string }[] = [
  { value: "ACTIVE", label: "Active" },
  { value: "ON_LEAVE", label: "On leave" },
  { value: "INACTIVE", label: "Inactive" },
  { value: "FORMER", label: "Former" },
];

const blank: TeamMemberInput = { fullName: "", jobTitle: "", department: null, startDate: null, status: "ACTIVE", workEmail: null, phone: null, location: null, managerName: null, notes: null, photoUrl: null };
const field = "mt-1.5 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm outline-none transition focus:border-brand-green focus:ring-2 focus:ring-brand-green/10";

function initials(name: string) { return name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(); }
function statusLabel(value: TeamMemberStatus) { return statuses.find((status) => status.value === value)?.label ?? value; }
function optional(value: string) { return value.trim() || null; }

export function TeamDirectoryClient() {
  const searchParams = useSearchParams();
  const { data: user } = useCurrentUser();
  const owner = user?.role === "SUPER_ADMIN";
  const members = useTeamMembers(owner);
  const create = useCreateTeamMember();
  const update = useUpdateTeamMember();
  const remove = useDeleteTeamMember();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | TeamMemberStatus>("ALL");
  const [editing, setEditing] = useState<TeamMember | null>(null);
  const [form, setForm] = useState<TeamMemberInput>(blank);
  const [open, setOpen] = useState(() => searchParams.get("new") === "1");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => (members.data ?? []).filter((member) => {
    const matchesStatus = filter === "ALL" || member.status === filter;
    const haystack = `${member.fullName} ${member.jobTitle} ${member.department ?? ""} ${member.location ?? ""}`.toLowerCase();
    return matchesStatus && haystack.includes(search.toLowerCase());
  }), [members.data, filter, search]);

  if (user && !owner) return <div className="p-6"><div className="mx-auto max-w-2xl rounded-2xl border border-amber-200 bg-amber-50 p-8"><h2 className="text-xl font-bold text-amber-950">Owner access required</h2><p className="mt-2 text-sm leading-6 text-amber-900">The personnel directory contains private organizational records and is available only to the account owner.</p></div></div>;

  function showCreate() { setEditing(null); setForm(blank); setError(""); setOpen(true); }
  function showEdit(member: TeamMember) {
    setEditing(member);
    setForm({ fullName: member.fullName, jobTitle: member.jobTitle, department: member.department, startDate: member.startDate, status: member.status, workEmail: member.workEmail, phone: member.phone, location: member.location, managerName: member.managerName, notes: member.notes, photoUrl: member.photoUrl });
    setError(""); setOpen(true);
  }
  function patch<K extends keyof TeamMemberInput>(key: K, value: TeamMemberInput[K]) { setForm((current) => ({ ...current, [key]: value })); }

  async function submit(event: React.FormEvent) {
    event.preventDefault(); setError("");
    const payload = { ...form, department: optional(form.department ?? ""), workEmail: optional(form.workEmail ?? ""), phone: optional(form.phone ?? ""), location: optional(form.location ?? ""), managerName: optional(form.managerName ?? ""), notes: optional(form.notes ?? ""), photoUrl: optional(form.photoUrl ?? "") };
    try {
      if (editing) await update.mutateAsync({ id: editing.id, data: payload }); else await create.mutateAsync(payload);
      setOpen(false);
    } catch { setError("The team member could not be saved. Check the information and try again."); }
  }

  async function uploadPhoto(file?: File) {
    if (!file) return;
    setUploading(true); setError("");
    try { const result = await uploadFile(file); patch("photoUrl", result.url); }
    catch (cause) { setError(cause instanceof Error ? cause.message : "Photo upload failed."); }
    finally { setUploading(false); }
  }

  async function deleteMember(member: TeamMember) {
    if (!window.confirm(`Permanently remove ${member.fullName} from the directory? Consider marking them Former instead to preserve organization history.`)) return;
    await remove.mutateAsync(member.id);
  }

  const allMembers = members.data ?? [];
  const metrics: { label: string; value: number; icon: LucideIcon }[] = [
    { label: "Total people", value: allMembers.length, icon: UsersRound },
    { label: "Active", value: allMembers.filter((member) => member.status === "ACTIVE").length, icon: UserRound },
    { label: "On leave", value: allMembers.filter((member) => member.status === "ON_LEAVE").length, icon: CalendarDays },
    { label: "Former", value: allMembers.filter((member) => member.status === "FORMER").length, icon: BriefcaseBusiness },
  ];
  return <div className="p-6 lg:p-8">
    <div className="mx-auto max-w-7xl space-y-7">
      <section className="flex flex-col justify-between gap-5 rounded-3xl bg-brand-navy p-7 text-white lg:flex-row lg:items-end">
        <div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#FFC72C]">Owner workspace</p><h2 className="mt-3 font-serif text-3xl font-bold">Your organization, in one place</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-white/70">Record everyone working with ShareHope, their role, when they joined, and whether they are currently active. This directory does not grant admin access.</p></div>
        <button onClick={showCreate} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#FFC72C] px-5 py-3 text-sm font-bold text-brand-navy"><Plus size={18} /> Add team member</button>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex items-center justify-between"><p className="text-sm font-semibold text-slate-500">{label}</p><Icon className="text-brand-green" size={19} /></div><p className="mt-3 text-3xl font-bold text-brand-navy">{value}</p></div>)}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search people, roles, or departments" className="w-full rounded-xl border border-slate-200 py-3 pl-10 pr-4 text-sm outline-none focus:border-brand-green" /></div>
          <div className="flex flex-wrap gap-2">{(["ALL", ...statuses.map((item) => item.value)] as const).map((value) => <button key={value} onClick={() => setFilter(value)} className={`rounded-full px-4 py-2 text-xs font-bold ${filter === value ? "bg-brand-navy text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}>{value === "ALL" ? "All" : statusLabel(value)}</button>)}</div>
        </div>
        {members.isLoading ? <p className="p-10 text-center text-sm text-slate-500">Loading team directory…</p> : members.isError ? <p className="p-10 text-center text-sm font-semibold text-red-700">The team directory could not be loaded.</p> : filtered.length === 0 ? <div className="p-14 text-center"><UsersRound className="mx-auto text-slate-300" size={38} /><h3 className="mt-4 font-semibold text-brand-navy">No team members found</h3><p className="mt-1 text-sm text-slate-500">Add the first person or adjust your search filters.</p></div> : <div className="divide-y divide-slate-100">{filtered.map((member) => <article key={member.id} className="grid gap-4 p-5 transition hover:bg-slate-50/70 lg:grid-cols-[minmax(260px,1.25fr)_1fr_1fr_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-4">{member.photoUrl ? <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-slate-100"><Image src={member.photoUrl} alt="" fill className="object-cover" sizes="48px" /></div> : <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#EFF6FF] text-sm font-black text-brand-green">{initials(member.fullName)}</div>}<div className="min-w-0"><h3 className="truncate font-bold text-brand-navy">{member.fullName}</h3><p className="truncate text-sm text-slate-600">{member.jobTitle}</p></div></div>
          <div><p className="text-sm font-medium text-slate-700">{member.department ?? "No department"}</p>{member.managerName && <p className="mt-1 text-xs text-slate-500">Reports to {member.managerName}</p>}</div>
          <div className="space-y-1"><span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide ${member.status === "ACTIVE" ? "bg-blue-100 text-blue-800" : member.status === "ON_LEAVE" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-600"}`}>{statusLabel(member.status)}</span>{member.startDate && <p className="text-xs text-slate-500">Joined {new Date(`${member.startDate}T12:00:00`).toLocaleDateString(undefined, { month: "short", year: "numeric" })}</p>}{member.location && <p className="flex items-center gap-1 text-xs text-slate-500"><MapPin size={12} />{member.location}</p>}</div>
          <div className="flex gap-2"><button onClick={() => showEdit(member)} aria-label={`Edit ${member.fullName}`} className="rounded-lg border border-slate-200 p-2.5 text-slate-600 hover:border-brand-green hover:text-brand-green"><Pencil size={16} /></button><button onClick={() => deleteMember(member)} aria-label={`Delete ${member.fullName}`} className="rounded-lg border border-slate-200 p-2.5 text-slate-500 hover:border-red-300 hover:text-red-600"><Trash2 size={16} /></button></div>
        </article>)}</div>}
      </section>
    </div>

    {open && <div className="fixed inset-0 z-[100] grid place-items-center bg-slate-950/55 p-4 backdrop-blur-sm" onMouseDown={(event) => { if (event.currentTarget === event.target) setOpen(false); }}><form onSubmit={submit} className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-[#FAFAF8] shadow-2xl">
      <header className="sticky top-0 z-10 flex items-start justify-between border-b border-slate-200 bg-white px-6 py-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-brand-green">Personnel record</p><h2 className="mt-1 font-serif text-2xl font-bold text-brand-navy">{editing ? "Edit team member" : "Add team member"}</h2></div><button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></header>
      <div className="grid gap-6 p-6 md:grid-cols-[150px_1fr]">
        <div><input ref={fileInput} type="file" accept="image/*" className="hidden" onChange={(event) => uploadPhoto(event.target.files?.[0])} /><button type="button" onClick={() => fileInput.current?.click()} className="relative grid aspect-square w-full place-items-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white text-slate-500 hover:border-brand-green">{form.photoUrl ? <Image src={form.photoUrl} alt="Profile preview" fill className="object-cover" sizes="150px" /> : <span className="text-center text-xs font-semibold"><ImagePlus className="mx-auto mb-2" />{uploading ? "Uploading…" : "Add photo"}</span>}</button></div>
        <div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Full name *<input required maxLength={160} value={form.fullName} onChange={(event) => patch("fullName", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700">Role or job title *<input required maxLength={160} value={form.jobTitle} onChange={(event) => patch("jobTitle", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700">Department<input maxLength={120} value={form.department ?? ""} onChange={(event) => patch("department", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700">Status<select value={form.status} onChange={(event) => patch("status", event.target.value as TeamMemberStatus)} className={field}>{statuses.map((status) => <option key={status.value} value={status.value}>{status.label}</option>)}</select></label><label className="text-sm font-semibold text-slate-700">Date joined<input type="date" value={form.startDate ?? ""} onChange={(event) => patch("startDate", event.target.value || null)} className={field} /></label></div>
      </div>
      <div className="grid gap-4 border-t border-slate-200 px-6 py-6 sm:grid-cols-2"><label className="text-sm font-semibold text-slate-700">Work email<input type="email" maxLength={320} value={form.workEmail ?? ""} onChange={(event) => patch("workEmail", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700">Phone<input maxLength={60} value={form.phone ?? ""} onChange={(event) => patch("phone", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700">Location<input maxLength={160} value={form.location ?? ""} onChange={(event) => patch("location", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700">Manager<input maxLength={160} value={form.managerName ?? ""} onChange={(event) => patch("managerName", event.target.value)} className={field} /></label><label className="text-sm font-semibold text-slate-700 sm:col-span-2">Internal notes<textarea rows={4} maxLength={4000} value={form.notes ?? ""} onChange={(event) => patch("notes", event.target.value)} className={field} /></label>{error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-700 sm:col-span-2">{error}</p>}</div>
      <footer className="sticky bottom-0 flex justify-end gap-3 border-t border-slate-200 bg-white px-6 py-4"><button type="button" onClick={() => setOpen(false)} className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-600">Cancel</button><button disabled={create.isPending || update.isPending || uploading} className="rounded-xl bg-brand-navy px-6 py-3 text-sm font-bold text-white disabled:opacity-50">{create.isPending || update.isPending ? "Saving…" : editing ? "Save changes" : "Add team member"}</button></footer>
    </form></div>}
  </div>;
}

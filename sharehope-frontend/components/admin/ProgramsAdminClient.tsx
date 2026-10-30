"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useLocale } from "next-intl";
import { useMemo, useState } from "react";
import { Eye, FileEdit, LayoutTemplate, List, Plus, Search, Shapes } from "lucide-react";
import { ProgramForm } from "@/components/admin/forms/ProgramForm";
import ProgramsContent from "@/components/public/ProgramsContent";
import { useAdminPrograms, useCreateProgram, useDeleteProgram, useUpdateProgram } from "@/hooks/usePrograms";
import type { AdminProgram, ProgramInput, PublicProgram } from "@/types/program";

export function ProgramsAdminClient() {
  const searchParams = useSearchParams();
  const locale: "en" | "fr" = useLocale() === "fr" ? "fr" : "en";
  const { data = [], isLoading, isError } = useAdminPrograms();
  const create = useCreateProgram();
  const update = useUpdateProgram();
  const remove = useDeleteProgram();
  const [editing, setEditing] = useState<AdminProgram | "new" | null>(() => searchParams.get("new") === "1" ? "new" : null);
  const [view, setView] = useState<"layout" | "library">("layout");
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "PUBLISHED" | "DRAFT">("ALL");

  const save = (input: ProgramInput) => {
    if (editing === "new") create.mutate(input, { onSuccess: () => setEditing(null) });
    else if (editing) update.mutate({ id: editing.id, data: input }, { onSuccess: () => setEditing(null) });
  };

  const previewPrograms = useMemo<PublicProgram[]>(() => data
    .filter((program) => includeDrafts || program.published)
    .sort((a, b) => a.displayOrder - b.displayOrder)
    .map((program) => {
      const text = program[locale] || program.en;
      return { id: program.id, slug: program.slug, category: program.category, displayOrder: program.displayOrder, featured: program.featured, imageUrl: program.imageUrl, ...text };
    }), [data, includeDrafts, locale]);

  const filtered = useMemo(() => data.filter((program) => {
    const status = program.published ? "PUBLISHED" : "DRAFT";
    const text = program[locale] || program.en;
    return (filter === "ALL" || filter === status) && `${text.title} ${program.category} ${text.description}`.toLowerCase().includes(query.toLowerCase());
  }), [data, filter, locale, query]);

  if (isLoading) return <p className="p-6 text-sm text-muted-foreground">Loading programs…</p>;
  if (isError) return <p className="p-6 text-sm text-destructive">Programs could not be loaded.</p>;

  return <div className="space-y-6 p-6 lg:p-8">
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-green">Program publishing</p><h1 className="mt-1 font-serif text-4xl font-bold text-brand-navy">Programs</h1><p className="mt-1 text-sm text-slate-500">Shape the public programs page and maintain every area of work.</p></div>
      <div className="flex flex-wrap gap-2"><div className="flex rounded-lg border bg-slate-100 p-1"><button onClick={() => setView("layout")} className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${view === "layout" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}><LayoutTemplate className="size-4" />Visual layout</button><button onClick={() => setView("library")} className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${view === "library" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}><List className="size-4" />Program library</button></div><button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white"><Plus className="size-4" />New program</button></div>
    </div>

    {editing && <ProgramForm key={editing === "new" ? "new" : editing.id} program={editing === "new" ? undefined : editing} locale={locale} order={data.length + 1} onSubmit={save} onCancel={() => setEditing(null)} isSubmitting={create.isPending || update.isPending} />}
    {(create.isError || update.isError || remove.isError) && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">The program change could not be saved. Check required content and make sure the slug is unique.</p>}

    {!editing && view === "layout" && <div className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-5 py-3"><div><p className="text-sm font-bold text-brand-navy">Public website layout</p><p className="text-xs text-slate-500">Click a program’s action button to edit its content, initiatives, or image.</p></div><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={includeDrafts} onChange={(event) => setIncludeDrafts(event.target.checked)} /> Preview drafts</label><a href={`/${locale}/programs`} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-green">Open public page ↗</a></div></div><ProgramsContent locale={locale} programs={previewPrograms} editor={{ onEditProgram: (slug) => { const program = data.find((item) => item.slug === slug); if (program) setEditing(program); }, onCreateProgram: () => setEditing("new") }} /></div>}

    {!editing && view === "library" && <>
      <section className="grid gap-3 sm:grid-cols-3">{[
        { label: "All programs", value: data.length, icon: Shapes },
        { label: "Published", value: data.filter((program) => program.published).length, icon: Eye },
        { label: "Drafts", value: data.filter((program) => !program.published).length, icon: FileEdit },
      ].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 rounded-xl border bg-white p-4"><span className="rounded-lg bg-brand-cream p-3 text-brand-navy"><Icon className="size-5" /></span><span><strong className="block text-2xl text-brand-navy">{value}</strong><small className="text-slate-500">{label}</small></span></div>)}</section>

      <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-3"><label className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, category, or description" className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-navy" /></label><div className="flex rounded-lg bg-slate-100 p-1">{(["ALL", "PUBLISHED", "DRAFT"] as const).map((status) => <button key={status} onClick={() => setFilter(status)} className={`rounded-md px-4 py-2 text-xs font-bold ${filter === status ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}>{status === "ALL" ? "All" : status === "PUBLISHED" ? "Published" : "Drafts"}</button>)}</div></div>

      {filtered.length === 0 ? <div className="rounded-xl border bg-white p-12 text-center text-sm text-slate-500">No programs match these filters.</div> : <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{filtered.map((program) => { const text = program[locale] || program.en; return <article key={program.id} className="overflow-hidden rounded-xl border bg-white shadow-sm"><div className="relative aspect-[16/9] bg-slate-100">{program.imageUrl && <Image src={program.imageUrl} alt={text.imageAlt || ""} fill className="object-cover" sizes="(min-width:1280px) 30vw, (min-width:768px) 45vw, 100vw" />}<span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-xs font-bold shadow-sm ${program.published ? "bg-blue-100 text-blue-800" : "bg-white text-slate-600"}`}>{program.published ? "Published" : "Draft"}</span>{program.featured && <span className="absolute left-3 top-3 rounded-full bg-[#FFC72C] px-3 py-1 text-xs font-bold text-brand-navy">Featured</span>}</div><div className="space-y-3 p-5"><p className="text-xs font-bold uppercase tracking-wider text-brand-green">{program.category}</p><h2 className="font-serif text-2xl font-bold text-brand-navy">{text.title}</h2><p className="line-clamp-3 text-sm leading-6 text-slate-600">{text.description}</p><p className="text-xs font-medium text-slate-500">{text.initiatives.filter(Boolean).length} key initiatives</p><div className="flex gap-2 pt-1"><button onClick={() => setEditing(program)} className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white">Edit</button><button onClick={() => { if (window.confirm(`Delete ${text.title}?`)) remove.mutate(program.id); }} className="rounded-lg border px-4 py-2 text-sm font-semibold text-red-700">Delete</button></div></div></article>; })}</div>}
    </>}
  </div>;
}

"use client";
import { useRef, useState } from "react";
import Image from "next/image";
import { ImagePlus, Plus, Trash2 } from "lucide-react";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import type { AdminProgram, ProgramInput, ProgramTranslation } from "@/types/program";

const emptyTranslation = (locale: "en" | "fr"): ProgramTranslation => ({ title: locale === "fr" ? "Nouveau programme" : "New Program", description: "", buttonText: locale === "fr" ? "En savoir plus" : "Learn more", imageAlt: "", initiatives: [""] });
export function ProgramForm({ program, locale, order, onSubmit, onCancel, isSubmitting }: { program?: AdminProgram; locale: "en" | "fr"; order: number; onSubmit: (data: ProgramInput) => void; onCancel: () => void; isSubmitting?: boolean }) {
  const [editLocale, setEditLocale] = useState<"en" | "fr">(locale);
  const [slug, setSlug] = useState(program?.slug ?? "new-program");
  const [category, setCategory] = useState(program?.category ?? "community");
  const [published, setPublished] = useState(program?.published ?? false);
  const [featured, setFeatured] = useState(program?.featured ?? false);
  const [imageUrl, setImageUrl] = useState(program?.imageUrl ?? "/images/hero-placeholders/children-school.png");
  const [translations, setTranslations] = useState({ en: program?.en ?? emptyTranslation("en"), fr: program?.fr ?? emptyTranslation("fr") });
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();
  const current = translations[editLocale];
  const update = (patch: Partial<ProgramTranslation>) => setTranslations((value) => ({ ...value, [editLocale]: { ...value[editLocale], ...patch } }));
  const replaceImage = (event: React.ChangeEvent<HTMLInputElement>) => { const file = event.target.files?.[0]; event.target.value = ""; if (!file) return; upload.mutate(file, { onSuccess: ({ url }) => setImageUrl(url) }); };
  return <form onSubmit={(event) => { event.preventDefault(); onSubmit({ slug, category, displayOrder: program?.displayOrder ?? order, published, featured, imageUrl, en: translations.en, fr: translations.fr }); }} className="overflow-hidden rounded-2xl border bg-[#FBF7EF] shadow-sm">
    <div className="flex flex-wrap items-center gap-4 border-b bg-white px-5 py-4 text-sm">
      <label>Slug <input value={slug} onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]+/g, "-"))} className="ml-2 rounded-md border px-2 py-1" /></label>
      <label>Category <select value={category} onChange={(e) => setCategory(e.target.value)} className="ml-2 rounded-md border px-2 py-1"><option value="education">Education</option><option value="health">Health</option><option value="community">Community</option></select></label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />Published</label>
      <label className="flex items-center gap-2"><input type="checkbox" checked={featured} onChange={(e) => setFeatured(e.target.checked)} />Featured</label>
      <div className="ml-auto flex rounded-lg border p-1"><button type="button" onClick={() => setEditLocale("en")} className={`rounded-md px-3 py-1 ${editLocale === "en" ? "bg-brand-navy text-white" : ""}`}>English</button><button type="button" onClick={() => setEditLocale("fr")} className={`rounded-md px-3 py-1 ${editLocale === "fr" ? "bg-brand-navy text-white" : ""}`}>Français</button></div>
    </div>
    <div className="grid gap-10 p-6 lg:grid-cols-12 lg:p-10">
      <div className="lg:col-span-5"><input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={replaceImage} /><button type="button" onClick={() => inputRef.current?.click()} className="group relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-stone-100"><Image src={imageUrl} alt="" fill className="object-cover" /><span className="absolute inset-0 grid place-items-center bg-black/0 font-semibold text-white opacity-0 transition group-hover:bg-black/40 group-hover:opacity-100"><span><ImagePlus className="mr-2 inline" />{upload.isPending ? "Uploading…" : "Replace image"}</span></span></button></div>
      <div className="space-y-5 lg:col-span-7">
        <input required={editLocale === "en"} aria-label="Program title" value={current.title} onChange={(e) => update({ title: e.target.value })} className="w-full border-0 bg-transparent font-serif text-4xl font-bold text-brand-navy outline-none focus:ring-2" />
        <textarea required={editLocale === "en"} aria-label="Program description" rows={5} value={current.description} onChange={(e) => update({ description: e.target.value })} className="w-full resize-none border-0 bg-transparent text-base leading-relaxed text-slate-600 outline-none focus:ring-2" />
        <div className="space-y-2"><p className="text-xs font-bold uppercase text-slate-500">Key initiatives</p>{current.initiatives.map((initiative, index) => <div key={index} className="flex gap-2"><input value={initiative} onChange={(e) => update({ initiatives: current.initiatives.map((item, itemIndex) => itemIndex === index ? e.target.value : item) })} className="flex-1 rounded-md border bg-white px-3 py-2 text-sm" /><button type="button" aria-label="Remove initiative" onClick={() => update({ initiatives: current.initiatives.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} /></button></div>)}<button type="button" onClick={() => update({ initiatives: [...current.initiatives, ""] })} className="inline-flex items-center gap-2 text-sm font-semibold"><Plus size={16} />Add initiative</button></div>
        <label className="block text-sm">Button text<input value={current.buttonText} onChange={(e) => update({ buttonText: e.target.value })} className="mt-1 w-full rounded-md border bg-white px-3 py-2" /></label>
        <label className="block text-sm">Image description<input value={current.imageAlt} onChange={(e) => update({ imageAlt: e.target.value })} className="mt-1 w-full rounded-md border bg-white px-3 py-2" /></label>
      </div>
    </div>
    <div className="flex items-center justify-end gap-3 border-t bg-white px-5 py-4">{(!translations.en.title.trim() || !translations.en.description.trim()) && <span className="mr-auto text-sm text-amber-700">English title and description are required.</span>}<button type="button" onClick={onCancel} className="rounded-lg border px-5 py-2">Cancel</button><button type="submit" disabled={isSubmitting || upload.isPending || !translations.en.title.trim() || !translations.en.description.trim()} className="rounded-lg bg-brand-navy px-6 py-2 font-semibold text-white disabled:opacity-50">{isSubmitting ? "Saving…" : "Save program"}</button></div>
  </form>;
}

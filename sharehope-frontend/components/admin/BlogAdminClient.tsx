"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import { BookOpen, Eye, FileText, Film, LayoutTemplate, List, Plus, Search, Settings2, Star, Trash2, UploadCloud, X } from "lucide-react";
import BlogContent from "@/components/public/BlogContent";
import type { CategoryId, Post } from "@/components/public/blog-data";
import {
  useAdminBlogPosts,
  useBlogSettings,
  useCreateBlogPost,
  useDeleteBlogPost,
  usePublishBlogPost,
  useUnpublishBlogPost,
  useUpdateBlogPost,
  useUpdateBlogSettings,
} from "@/hooks/useBlog";
import { useMediaUpload } from "@/hooks/useMediaUpload";
import type { AdminBlogPost, BlogPageSettings, BlogPostInput, BlogTranslation } from "@/types/blog";

const field = "mt-1.5 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/10";
const blankTranslation = (): BlogTranslation => ({
  title: "",
  excerpt: "",
  body: "",
  imageAlt: "",
  buttonText: "Read the story",
  authorName: "ShareHope Editorial Team",
  seoTitle: "",
  seoDescription: "",
  tags: [],
});

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function formatDuration(seconds: number | null) {
  if (!seconds) return null;
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;
  return `${minutes}:${String(remainder).padStart(2, "0")}`;
}

function previewCategory(category: string): Exclude<CategoryId, "all"> {
  const value = category.toLowerCase();
  if (value.includes("education")) return "education";
  if (value.includes("health")) return "health";
  if (value.includes("community")) return "community";
  return "field-notes";
}

function previewPost(post: AdminBlogPost): Post {
  const words = post.en.body.trim().split(/\s+/).filter(Boolean).length;
  return { slug: post.slug, category: previewCategory(post.category), title: post.en.title, excerpt: post.en.excerpt, date: new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.publishedAt ?? post.updatedAt)), readTime: post.format === "VIDEO" && post.durationSeconds ? formatDuration(post.durationSeconds) ?? "Video" : `${Math.max(1, Math.ceil(words / 220))} min read`, image: post.coverImageUrl || "/images/hero-placeholders/children-school.png", imageAlt: post.en.imageAlt, format: post.format, videoUrl: post.videoUrl, durationSeconds: post.durationSeconds, authorName: post.en.authorName, body: post.en.body.split(/\n\s*\n/).filter(Boolean) };
}

function PageSettingsEditor({ initial, close }: { initial: BlogPageSettings; close: () => void }) {
  const [value, setValue] = useState(initial); const save = useUpdateBlogSettings(); const change = (key: keyof BlogPageSettings, next: string) => setValue((current) => ({ ...current, [key]: next }));
  return <form onSubmit={(event) => { event.preventDefault(); save.mutate(value, { onSuccess: close }); }} className="overflow-hidden rounded-2xl border bg-white shadow-sm"><header className="flex items-center border-b bg-slate-50 px-6 py-4"><div><p className="text-xs font-bold uppercase tracking-wider text-brand-green">Public blog</p><h2 className="font-serif text-2xl font-bold text-brand-navy">Edit page content</h2></div><button type="button" onClick={close} className="ml-auto rounded-lg border bg-white p-2"><X className="size-5" /></button></header><div className="grid gap-6 p-6 lg:grid-cols-2"><section className="space-y-4"><h3 className="font-serif text-xl font-bold text-brand-navy">Masthead</h3>{([['eyebrow','Eyebrow'],['title','Page title'],['lead','Introduction'],['featuredLabel','Featured label']] as const).map(([key,label]) => <label key={key} className="block text-sm font-semibold">{label}{key === 'lead' ? <textarea rows={4} value={value[key]} onChange={(event) => change(key,event.target.value)} className={field} /> : <input value={value[key]} onChange={(event) => change(key,event.target.value)} className={field} />}</label>)}</section><section className="space-y-4"><h3 className="font-serif text-xl font-bold text-brand-navy">Newsletter and empty states</h3>{([['newsletterTitle','Newsletter heading'],['newsletterBody','Newsletter description'],['newsletterCta','Newsletter button'],['emptyState','Empty category message']] as const).map(([key,label]) => <label key={key} className="block text-sm font-semibold">{label}{key === 'newsletterBody' ? <textarea rows={3} value={value[key]} onChange={(event) => change(key,event.target.value)} className={field} /> : <input value={value[key]} onChange={(event) => change(key,event.target.value)} className={field} />}</label>)}</section></div><footer className="flex justify-end gap-3 border-t px-6 py-4"><button type="button" onClick={close} className="rounded-lg border px-5 py-2.5">Cancel</button><button disabled={save.isPending} className="rounded-lg bg-brand-navy px-6 py-2.5 font-semibold text-white">{save.isPending ? 'Saving…' : 'Save page content'}</button></footer></form>;
}

function PostEditor({ post, order, onSave, onCancel, busy }: { post?: AdminBlogPost; order: number; onSave: (input: BlogPostInput) => void; onCancel: () => void; busy: boolean }) {
  const [content, setContent] = useState<BlogTranslation>(post?.en ?? blankTranslation());
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(post));
  const [category, setCategory] = useState(post?.category ?? "Field Notes");
  const [format, setFormat] = useState<BlogPostInput["format"]>(post?.format ?? "ARTICLE");
  const [status, setStatus] = useState<BlogPostInput["status"]>(post?.status ?? "DRAFT");
  const [featured, setFeatured] = useState(post?.featured ?? false);
  const [coverImageUrl, setCoverImageUrl] = useState(post?.coverImageUrl ?? "");
  const [videoUrl, setVideoUrl] = useState(post?.videoUrl ?? "");
  const [duration, setDuration] = useState(post?.durationSeconds?.toString() ?? "");
  const [relatedProgramSlug, setRelatedProgramSlug] = useState(post?.relatedProgramSlug ?? "");
  const [showSeo, setShowSeo] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useMediaUpload();
  const patch = (value: Partial<BlogTranslation>) => setContent((current) => ({ ...current, ...value }));

  const changeTitle = (title: string) => {
    patch({ title, seoTitle: content.seoTitle || title });
    if (!slugTouched) setSlug(slugify(title));
  };

  const valid = content.title.trim() && content.excerpt.trim() && content.body.trim() && slug && category.trim() && (format === "ARTICLE" || videoUrl.trim());

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!valid) return;
        onSave({
          slug,
          category: category.trim(),
          format,
          status,
          featured,
          displayOrder: post?.displayOrder ?? order,
          coverImageUrl: coverImageUrl || null,
          videoUrl: format === "VIDEO" ? videoUrl || null : null,
          durationSeconds: format === "VIDEO" && duration ? Number(duration) : null,
          relatedProgramSlug: relatedProgramSlug || null,
          en: { ...content, tags: content.tags.filter(Boolean) },
          fr: null,
        });
      }}
      className="overflow-hidden rounded-2xl border bg-white shadow-sm"
    >
      <header className="flex flex-wrap items-center gap-4 border-b bg-slate-50 px-6 py-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-brand-green">Blog editor</p>
          <h2 className="font-serif text-2xl font-bold text-brand-navy">{post ? "Edit post" : "Create a post"}</h2>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <select value={status} onChange={(event) => setStatus(event.target.value as BlogPostInput["status"])} className="rounded-lg border bg-white px-3 py-2 text-sm font-semibold">
            <option value="DRAFT">Save as draft</option>
            <option value="PUBLISHED">Publish</option>
          </select>
          <button type="button" onClick={onCancel} className="rounded-lg border bg-white p-2 text-slate-600" aria-label="Close editor"><X className="size-5" /></button>
        </div>
      </header>

      <div className="grid xl:grid-cols-[minmax(0,1fr)_380px]">
        <div className="space-y-8 p-6 lg:p-8">
          <section className="space-y-5">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">Format
                <select value={format} onChange={(event) => setFormat(event.target.value as BlogPostInput["format"])} className={field}>
                  <option value="ARTICLE">Written article</option>
                  <option value="VIDEO">Video story</option>
                </select>
              </label>
              <label className="text-sm font-semibold text-slate-700">Category
                <select value={category} onChange={(event) => setCategory(event.target.value)} className={field}>
                  <option value="Education">Education</option>
                  <option value="Health">Health</option>
                  <option value="Community">Community</option>
                  <option value="Field Notes">Field Notes</option>
                </select>
              </label>
            </div>
            <label className="block text-sm font-semibold text-slate-700">Title
              <input value={content.title} onChange={(event) => changeTitle(event.target.value)} placeholder="A clear, compelling headline" className={`${field} font-serif text-2xl font-bold text-brand-navy`} />
            </label>
            <label className="block text-sm font-semibold text-slate-700">Short introduction
              <textarea rows={3} maxLength={320} value={content.excerpt} onChange={(event) => patch({ excerpt: event.target.value })} placeholder="Tell readers why this story matters." className={field} />
              <span className="mt-1 block text-right text-xs font-normal text-slate-400">{content.excerpt.length}/320</span>
            </label>
            <label className="block text-sm font-semibold text-slate-700">Story
              <textarea rows={14} value={content.body} onChange={(event) => patch({ body: event.target.value })} placeholder="Write the full story. Separate paragraphs with a blank line." className={`${field} min-h-80 leading-7`} />
            </label>
          </section>

          {format === "VIDEO" && (
            <section className="grid gap-4 rounded-xl border bg-slate-50 p-5 md:grid-cols-[1fr_180px]">
              <div className="md:col-span-2"><h3 className="font-serif text-xl font-bold text-brand-navy">Video details</h3><p className="text-sm text-slate-500">Use a public YouTube, Vimeo, or hosted video URL.</p></div>
              <label className="text-sm font-semibold">Video URL<input type="url" value={videoUrl} onChange={(event) => setVideoUrl(event.target.value)} placeholder="https://…" className={field} /></label>
              <label className="text-sm font-semibold">Duration in seconds<input type="number" min="1" value={duration} onChange={(event) => setDuration(event.target.value)} className={field} /></label>
            </section>
          )}

          <section className="grid gap-4 rounded-xl border p-5 md:grid-cols-2">
            <div className="md:col-span-2"><h3 className="font-serif text-xl font-bold text-brand-navy">Organization</h3><p className="text-sm text-slate-500">Help readers discover related stories and programs.</p></div>
            <label className="text-sm font-semibold">Author<input value={content.authorName} onChange={(event) => patch({ authorName: event.target.value })} className={field} /></label>
            <label className="text-sm font-semibold">Related program slug<input value={relatedProgramSlug} onChange={(event) => setRelatedProgramSlug(slugify(event.target.value))} placeholder="education-access" className={field} /></label>
            <label className="text-sm font-semibold md:col-span-2">Tags <span className="font-normal text-slate-400">(comma separated)</span><input value={content.tags.join(", ")} onChange={(event) => patch({ tags: event.target.value.split(",").map((tag) => tag.trim()) })} placeholder="Education, Community, Impact" className={field} /></label>
            <label className="text-sm font-semibold md:col-span-2">Button label<input value={content.buttonText} onChange={(event) => patch({ buttonText: event.target.value })} className={field} /></label>
          </section>

          <section className="rounded-xl border">
            <button type="button" onClick={() => setShowSeo((value) => !value)} className="flex w-full items-center justify-between p-5 text-left"><span><strong className="font-serif text-xl text-brand-navy">Search preview</strong><small className="mt-1 block text-sm text-slate-500">Optional title and description for search engines.</small></span><span className="text-sm font-semibold">{showSeo ? "Hide" : "Edit"}</span></button>
            {showSeo && <div className="grid gap-4 border-t p-5"><label className="text-sm font-semibold">SEO title<input value={content.seoTitle} onChange={(event) => patch({ seoTitle: event.target.value })} maxLength={70} className={field} /></label><label className="text-sm font-semibold">SEO description<textarea value={content.seoDescription} onChange={(event) => patch({ seoDescription: event.target.value })} maxLength={170} rows={3} className={field} /></label></div>}
          </section>
        </div>

        <aside className="space-y-6 border-l bg-brand-cream/40 p-6">
          <section>
            <div className="flex items-center justify-between"><h3 className="text-xs font-bold uppercase tracking-[.18em] text-brand-navy">Cover image</h3>{coverImageUrl && <button type="button" onClick={() => setCoverImageUrl("")} className="text-xs font-semibold text-red-700">Remove</button>}</div>
            <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={(event) => { const selected = event.target.files?.[0]; event.target.value = ""; if (selected) upload.mutate(selected, { onSuccess: (result) => setCoverImageUrl(result.url) }); }} />
            <button type="button" onClick={() => inputRef.current?.click()} className="relative mt-3 flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-xl border border-dashed bg-white text-slate-500">
              {coverImageUrl ? <Image src={coverImageUrl} alt={content.imageAlt || "Cover preview"} fill className="object-cover" /> : <span className="flex flex-col items-center gap-2 text-sm font-semibold"><UploadCloud className="size-7" />Upload cover image</span>}
              {coverImageUrl && <span className="absolute inset-x-0 bottom-0 bg-black/65 p-2 text-sm font-semibold text-white">{upload.isPending ? "Uploading…" : "Replace image"}</span>}
            </button>
            <label className="mt-3 block text-sm font-semibold">Image description<input value={content.imageAlt} onChange={(event) => patch({ imageAlt: event.target.value })} placeholder="Describe the image for accessibility" className={field} /></label>
          </section>

          <section className="rounded-xl border bg-white p-4">
            <h3 className="font-bold text-brand-navy">Publishing settings</h3>
            <label className="mt-4 block text-sm font-semibold">URL slug<input value={slug} onChange={(event) => { setSlugTouched(true); setSlug(slugify(event.target.value)); }} className={field} /></label>
            <label className="mt-4 flex cursor-pointer items-start gap-3 rounded-lg bg-amber-50 p-3"><input type="checkbox" checked={featured} onChange={(event) => setFeatured(event.target.checked)} className="mt-0.5 size-4" /><span><strong className="block text-sm text-brand-navy">Feature this post</strong><small className="text-slate-500">Show it prominently on the blog landing page.</small></span></label>
          </section>

          <section className="overflow-hidden rounded-xl border bg-white">
            <div className="relative aspect-[16/9] bg-slate-100">{coverImageUrl ? <Image src={coverImageUrl} alt="" fill className="object-cover" /> : <div className="flex h-full items-center justify-center"><BookOpen className="size-8 text-slate-300" /></div>}<span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-navy">Live card preview</span></div>
            <div className="p-4"><p className="text-xs font-bold uppercase tracking-wider text-brand-green">{category || "Category"}</p><h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-brand-navy">{content.title || "Your story title"}</h3><p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{content.excerpt || "Your short introduction will appear here."}</p></div>
          </section>
        </aside>
      </div>

      <footer className="sticky bottom-0 z-10 flex items-center justify-between border-t bg-white/95 px-6 py-4 backdrop-blur">
        <p className="hidden text-xs text-slate-500 sm:block">Required: title, introduction, story, category, and slug.</p>
        <div className="ml-auto flex gap-3"><button type="button" onClick={onCancel} className="rounded-lg border px-5 py-2.5 text-sm font-semibold">Cancel</button><button disabled={busy || upload.isPending || !valid} className="rounded-lg bg-brand-navy px-6 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40">{busy ? "Saving…" : status === "PUBLISHED" ? "Save and publish" : "Save draft"}</button></div>
      </footer>
    </form>
  );
}

export function BlogAdminClient() {
  const searchParams = useSearchParams();
  const { data = [], isLoading, isError } = useAdminBlogPosts();
  const pageSettings = useBlogSettings();
  const create = useCreateBlogPost();
  const update = useUpdateBlogPost();
  const publish = usePublishBlogPost();
  const unpublish = useUnpublishBlogPost();
  const remove = useDeleteBlogPost();
  const [editing, setEditing] = useState<AdminBlogPost | "new" | null>(() => searchParams.get("new") === "1" ? "new" : null);
  const [view, setView] = useState<"layout" | "library">("layout");
  const [showSettings, setShowSettings] = useState(false);
  const [includeDrafts, setIncludeDrafts] = useState(false);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"ALL" | "DRAFT" | "PUBLISHED">("ALL");

  const filtered = useMemo(() => data.filter((post) => {
    const matchesStatus = filter === "ALL" || post.status === filter;
    const haystack = `${post.en.title} ${post.category} ${post.en.authorName}`.toLowerCase();
    return matchesStatus && haystack.includes(query.toLowerCase());
  }), [data, filter, query]);
  const previewPosts = useMemo(() => [...data].filter((post) => includeDrafts || post.status === "PUBLISHED").sort((a, b) => Number(b.featured) - Number(a.featured) || new Date(b.publishedAt ?? b.updatedAt).getTime() - new Date(a.publishedAt ?? a.updatedAt).getTime()).map(previewPost), [data, includeDrafts]);

  const save = (input: BlogPostInput) => editing === "new"
    ? create.mutate(input, { onSuccess: () => setEditing(null) })
    : editing && update.mutate({ id: editing.id, data: input }, { onSuccess: () => setEditing(null) });

  const failed = create.isError || update.isError || publish.isError || unpublish.isError || remove.isError;
  if (isLoading) return <div className="p-8 text-sm text-slate-500">Loading blog posts…</div>;
  if (isError) return <div className="m-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm font-medium text-red-800">Blog posts could not be loaded. Confirm that the backend is running and migration V22 has been applied.</div>;

  return (
    <div className="space-y-6 p-6 lg:p-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-xs font-bold uppercase tracking-[.2em] text-brand-green">Content publishing</p><h1 className="mt-1 font-serif text-4xl font-bold text-brand-navy">Blog</h1><p className="mt-1 text-sm text-slate-500">Create polished articles and video stories for the public website.</p></div>
        <div className="flex flex-wrap gap-2"><div className="flex rounded-lg border bg-slate-100 p-1"><button onClick={() => setView("layout")} className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${view === "layout" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}><LayoutTemplate className="size-4" />Visual layout</button><button onClick={() => setView("library")} className={`flex items-center gap-2 rounded-md px-3 py-2 text-xs font-bold ${view === "library" ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}><List className="size-4" />Content library</button></div><button disabled={!pageSettings.data} onClick={() => setShowSettings(true)} className="flex items-center gap-2 rounded-lg border border-brand-navy px-4 py-2.5 text-sm font-semibold text-brand-navy disabled:opacity-40"><Settings2 className="size-4" />Page content</button><button onClick={() => setEditing("new")} className="flex items-center gap-2 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-semibold text-white shadow-sm"><Plus className="size-4" />New post</button></div>
      </div>

      {showSettings && pageSettings.data && <PageSettingsEditor initial={pageSettings.data} close={() => setShowSettings(false)} />}
      {editing && <PostEditor key={editing === "new" ? "new" : editing.id} post={editing === "new" ? undefined : editing} order={data.length + 1} onSave={save} onCancel={() => setEditing(null)} busy={create.isPending || update.isPending} />}
      {failed && <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800">The change could not be saved. Check required fields, URL format, and that the slug is unique.</p>}

      {!editing && !showSettings && view === "layout" && <div className="overflow-hidden rounded-2xl border bg-white shadow-sm"><div className="flex flex-wrap items-center justify-between gap-3 border-b bg-slate-50 px-5 py-3"><div><p className="text-sm font-bold text-brand-navy">Public website layout</p><p className="text-xs text-slate-500">Click any story or highlighted page section to edit it.</p></div><div className="flex items-center gap-3"><label className="flex items-center gap-2 text-xs font-semibold text-slate-600"><input type="checkbox" checked={includeDrafts} onChange={(event) => setIncludeDrafts(event.target.checked)} /> Preview drafts</label><a href="/en/blog" target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-green">Open public page ↗</a></div></div><BlogContent locale="en" posts={previewPosts} settings={pageSettings.data} editor={{ onEditPost: (slug) => { const post = data.find((item) => item.slug === slug); if (post) setEditing(post); }, onEditPage: () => setShowSettings(true), onCreatePost: () => setEditing("new") }} /></div>}

      {!editing && !showSettings && view === "library" && <>
        <section className="grid gap-3 sm:grid-cols-3">
          {[{ label: "All posts", value: data.length, icon: FileText }, { label: "Published", value: data.filter((post) => post.status === "PUBLISHED").length, icon: Eye }, { label: "Drafts", value: data.filter((post) => post.status === "DRAFT").length, icon: BookOpen }].map(({ label, value, icon: Icon }) => <div key={label} className="flex items-center gap-4 rounded-xl border bg-white p-4"><span className="rounded-lg bg-brand-cream p-3 text-brand-navy"><Icon className="size-5" /></span><span><strong className="block text-2xl text-brand-navy">{value}</strong><small className="text-slate-500">{label}</small></span></div>)}
        </section>

        <div className="flex flex-wrap gap-3 rounded-xl border bg-white p-3">
          <label className="relative min-w-64 flex-1"><Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search title, category, or author" className="w-full rounded-lg border py-2.5 pl-10 pr-3 text-sm outline-none focus:border-brand-navy" /></label>
          <div className="flex rounded-lg bg-slate-100 p-1">{(["ALL", "PUBLISHED", "DRAFT"] as const).map((status) => <button key={status} onClick={() => setFilter(status)} className={`rounded-md px-4 py-2 text-xs font-bold ${filter === status ? "bg-white text-brand-navy shadow-sm" : "text-slate-500"}`}>{status === "ALL" ? "All" : status === "PUBLISHED" ? "Published" : "Drafts"}</button>)}</div>
        </div>

        {filtered.length === 0 ? <div className="rounded-2xl border border-dashed bg-white py-16 text-center"><BookOpen className="mx-auto size-9 text-slate-300" /><h2 className="mt-3 font-serif text-2xl font-bold text-brand-navy">No posts found</h2><p className="mt-1 text-sm text-slate-500">Create a new story or adjust your search.</p></div> : <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">{filtered.map((post) => <article key={post.id} className="group overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div className="relative aspect-[16/9] bg-slate-100">{post.coverImageUrl ? <Image src={post.coverImageUrl} alt={post.en.imageAlt || ""} fill className="object-cover" /> : <div className="flex h-full items-center justify-center"><BookOpen className="size-8 text-slate-300" /></div>}<div className="absolute inset-x-0 top-0 flex items-start justify-between p-3"><span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${post.status === "PUBLISHED" ? "bg-blue-100 text-blue-800" : "bg-white text-slate-600"}`}>{post.status === "PUBLISHED" ? "Published" : "Draft"}</span><div className="flex gap-1">{post.featured && <span className="rounded-full bg-amber-100 p-1.5 text-amber-700" title="Featured"><Star className="size-3.5 fill-current" /></span>}<span className="rounded-full bg-white p-1.5 text-brand-navy" title={post.format === "VIDEO" ? "Video" : "Article"}>{post.format === "VIDEO" ? <Film className="size-3.5" /> : <FileText className="size-3.5" />}</span></div></div></div>
          <div className="space-y-3 p-5"><div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-brand-green"><span>{post.category}</span>{post.format === "VIDEO" && formatDuration(post.durationSeconds) && <span className="text-slate-400">{formatDuration(post.durationSeconds)}</span>}</div><h2 className="font-serif text-2xl font-bold leading-tight text-brand-navy">{post.en.title}</h2><p className="line-clamp-2 text-sm leading-6 text-slate-600">{post.en.excerpt}</p><div className="flex items-center justify-between border-t pt-4 text-xs text-slate-400"><span>{post.en.authorName || "No author"}</span><span>{new Intl.DateTimeFormat("en-US", { dateStyle: "medium" }).format(new Date(post.updatedAt))}</span></div><div className="flex flex-wrap gap-2"><button onClick={() => setEditing(post)} className="rounded-lg bg-brand-navy px-4 py-2 text-sm font-semibold text-white">Edit</button>{post.status === "DRAFT" ? <button disabled={publish.isPending} onClick={() => publish.mutate(post.id)} className="rounded-lg border border-brand-green px-4 py-2 text-sm font-semibold text-brand-green">Publish</button> : <button disabled={unpublish.isPending} onClick={() => unpublish.mutate(post.id)} className="rounded-lg border px-4 py-2 text-sm font-semibold text-slate-600">Unpublish</button>}<button onClick={() => { if (window.confirm(`Delete “${post.en.title}”? This cannot be undone.`)) remove.mutate(post.id); }} className="ml-auto rounded-lg border p-2 text-red-700" aria-label={`Delete ${post.en.title}`}><Trash2 className="size-4" /></button></div></div>
        </article>)}</div>}
      </>}
    </div>
  );
}

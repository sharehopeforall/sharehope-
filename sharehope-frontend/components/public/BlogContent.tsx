"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import type { BlogPageSettings } from "@/types/blog";
import { copy, type CategoryId, type Post } from "./blog-data";

const CATEGORY_ORDER: CategoryId[] = ["all", "education", "health", "community", "field-notes"];

interface BlogEditorControls {
  onEditPost: (slug: string) => void;
  onEditPage?: () => void;
  onCreatePost: () => void;
}

export default function BlogContent({ locale, posts: managedPosts, settings, editor }: { locale: string; posts?: Post[]; settings?: BlogPageSettings | null; editor?: BlogEditorControls }) {
  const fallback = locale === "fr" ? copy.fr : copy.en;
  const t = { ...fallback, ...(settings ?? {}) };
  const [active, setActive] = useState<CategoryId>("all");

  const sourcePosts: readonly Post[] = managedPosts ?? t.posts;
  const [featured, second, third, ...rest] = sourcePosts;
  const mosaic = [featured, second, third];
  const posts = active === "all" ? rest : sourcePosts.filter((p) => p.category === active);
  const categoryLabel = (id: Exclude<CategoryId, "all">) => t.categories[id];
  const edit = (event: React.MouseEvent, slug: string) => { if (!editor) return; event.preventDefault(); editor.onEditPost(slug); };

  return (
    <div className="bg-brand-cream text-[#121212]">
      {/* Masthead — navy band */}
      <section className="relative bg-brand-navy px-6 py-16 text-center text-white sm:py-20">
        {editor?.onEditPage && <button type="button" onClick={editor.onEditPage} className="absolute right-5 top-5 rounded-full border border-white/30 bg-white px-4 py-2 text-xs font-bold text-brand-navy shadow-lg">Edit page header</button>}
        <p className="font-mono-spaced text-xs font-bold uppercase text-[#FFC72C]">{t.eyebrow}</p>
        <h1 className="font-serif mt-4 text-4xl font-bold leading-[1.05] sm:text-5xl">{t.title}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/75 sm:text-base">{t.lead}</p>
      </section>

      {/* Bento mosaic */}
      <section className="relative mx-auto max-w-6xl px-6 py-14">
        {editor && <button type="button" onClick={editor.onCreatePost} className="mb-5 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-bold text-white shadow">+ Add story</button>}
        <div className="grid gap-5 lg:grid-cols-2">
          {/* Large tile */}
          <Link
            href={`/blog/${mosaic[0].slug}`}
            onClick={(event) => edit(event, mosaic[0].slug)}
            className="group relative min-h-[320px] overflow-hidden rounded-2xl lg:min-h-[460px]"
          >
            {editor && <span className="absolute right-4 top-4 z-10 rounded-full bg-white px-3 py-1.5 text-xs font-bold text-brand-navy shadow">Edit story</span>}
            <Image
              src={mosaic[0].image}
              alt={mosaic[0].imageAlt}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-7">
              <div className="flex items-center gap-3">
                <span className="font-mono-spaced rounded-full bg-[#FFC72C] px-3 py-1 text-[10px] font-bold uppercase text-[#121212]">
                  {t.featuredLabel}
                </span>
                <span className="font-mono-spaced text-[10px] font-bold uppercase text-white/80">
                  {categoryLabel(mosaic[0].category)}
                </span>
              </div>
              <h2 className="font-serif mt-4 text-3xl font-bold leading-tight text-white transition-colors group-hover:text-[#FFC72C] sm:text-4xl">
                {mosaic[0].title}
              </h2>
              <p className="font-mono-spaced mt-3 text-[10px] font-bold uppercase text-white/70">
                {mosaic[0].date} · {mosaic[0].readTime}
              </p>
            </div>
          </Link>

          {/* Two stacked tiles */}
          <div className="grid gap-5">
            {mosaic.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClick={(event) => edit(event, post.slug)}
                className="group relative min-h-[150px] overflow-hidden rounded-2xl sm:min-h-[180px]"
              >
                {editor && <span className="absolute right-3 top-3 z-10 rounded-full bg-white px-3 py-1 text-[10px] font-bold text-brand-navy shadow">Edit</span>}
                <Image
                  src={post.image}
                  alt={post.imageAlt}
                  fill
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6">
                  <span className="font-mono-spaced text-[10px] font-bold uppercase text-[#FFC72C]">
                    {categoryLabel(post.category)}
                  </span>
                  <h3 className="font-serif mt-2 text-xl font-bold leading-snug text-white transition-colors group-hover:text-[#FFC72C] sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="font-mono-spaced mt-2 text-[10px] font-bold uppercase text-white/70">
                    {post.date} · {post.readTime}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Underline tabs + text index */}
      <section className="border-t border-[#E5E0D8] bg-white">
        <div className="mx-auto max-w-6xl px-6 py-14">
          <div className="font-mono-spaced flex flex-wrap gap-x-8 gap-y-2 border-b border-[#E5E0D8] text-xs font-bold uppercase tracking-wider">
            {CATEGORY_ORDER.map((id) => (
              <button
                key={id}
                onClick={() => setActive(id)}
                aria-pressed={active === id}
                className={`border-b-2 pb-3 transition-colors ${
                  active === id
                    ? "border-[#F05A24] text-brand-navy"
                    : "border-transparent text-slate-400 hover:text-brand-navy"
                }`}
              >
                {id === "all" ? t.categories.all : t.categories[id]}
              </button>
            ))}
          </div>

          {posts.length === 0 && (
            <p className="py-10 text-center text-slate-600">{t.emptyState}</p>
          )}
          <div className="divide-y divide-[#E5E0D8]">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                onClick={(event) => edit(event, post.slug)}
                className="group flex flex-col gap-4 py-7 sm:flex-row sm:items-center sm:gap-8"
              >
                <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg sm:w-44">
                  <Image
                    src={post.image}
                    alt={post.imageAlt}
                    fill
                    sizes="(min-width: 640px) 176px, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-mono-spaced text-[11px] font-bold uppercase text-slate-400">
                    {post.date}
                  </p>
                  <h3 className="font-serif mt-1 text-xl font-semibold leading-snug text-brand-navy transition-colors group-hover:text-[#F05A24] sm:text-2xl">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {post.excerpt}
                  </p>
                </div>
                <span className="font-mono-spaced shrink-0 text-[10px] font-bold uppercase text-[#F05A24]">
                  {categoryLabel(post.category)}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="relative border-t border-[#E5E0D8] bg-[#FFC72C] px-6 py-14">
        {editor?.onEditPage && <button type="button" onClick={editor.onEditPage} className="absolute right-5 top-5 rounded-full bg-white px-4 py-2 text-xs font-bold text-brand-navy shadow">Edit newsletter</button>}
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-serif text-2xl font-bold text-[#121212] sm:text-3xl">{t.newsletterTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-[#121212]/75 sm:text-base">{t.newsletterBody}</p>
          </div>
          <Link
            href="/#newsletter"
            className="font-mono-spaced inline-flex shrink-0 items-center rounded-lg bg-brand-navy px-7 py-3.5 text-xs font-bold uppercase tracking-widest text-white shadow-md transition-all hover:-translate-y-0.5 hover:bg-[#0a1f33]"
          >
            {t.newsletterCta}
          </Link>
        </div>
      </section>
    </div>
  );
}

import { setRequestLocale } from "next-intl/server";
import BlogContent from "@/components/public/BlogContent";
import type { CategoryId, Post } from "@/components/public/blog-data";
import { getPublicBlogPosts, getPublicBlogSettings } from "@/lib/server/public-blog";
import type { PublicBlogPostSummary } from "@/types/blog";

function category(value: string): Exclude<CategoryId, "all"> { const normalized = value.toLowerCase(); if (normalized.includes("education")) return "education"; if (normalized.includes("health")) return "health"; if (normalized.includes("community")) return "community"; return "field-notes"; }
function toPost(value: PublicBlogPostSummary, locale: string): Post { return { slug: value.slug, category: category(value.category), title: value.title, excerpt: value.excerpt, date: new Intl.DateTimeFormat(locale === "fr" ? "fr-CA" : "en-US", { dateStyle: "medium" }).format(new Date(value.publishedAt)), readTime: value.format === "VIDEO" && value.durationSeconds ? `${Math.floor(value.durationSeconds / 60)}:${String(value.durationSeconds % 60).padStart(2, "0")}` : `${value.readingTimeMinutes} ${locale === "fr" ? "min de lecture" : "min read"}`, image: value.coverImageUrl || "/images/hero-placeholders/children-school.png", imageAlt: value.imageAlt, format: value.format, videoUrl: value.videoUrl, durationSeconds: value.durationSeconds, authorName: value.authorName }; }

export default async function BlogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const [posts, settings] = await Promise.all([getPublicBlogPosts(locale), getPublicBlogSettings(locale)]);
  return <BlogContent locale={locale} posts={posts?.map((item) => toPost(item, locale))} settings={settings} />;
}

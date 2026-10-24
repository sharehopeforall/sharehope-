import type { BlogPageSettings, PublicBlogPost, PublicBlogPostSummary } from "@/types/blog";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function getPublicBlogPosts(locale: string): Promise<PublicBlogPostSummary[] | null> {
  try {
    const response = await fetchBackend(`${backendUrl}/api/public/blog?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json() as Promise<PublicBlogPostSummary[]>;
  } catch {
    return null;
  }
}

export async function getPublicBlogPost(locale: string, slug: string): Promise<PublicBlogPost | null> {
  try {
    const response = await fetchBackend(`${backendUrl}/api/public/blog/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
    if (!response.ok) return null;
    return response.json() as Promise<PublicBlogPost>;
  } catch {
    return null;
  }
}

export async function getPublicBlogSettings(locale: string): Promise<BlogPageSettings | null> {
  try { const response = await fetchBackend(`${backendUrl}/api/public/blog/settings?locale=${encodeURIComponent(locale)}`, { cache: "no-store" }); return response.ok ? response.json() as Promise<BlogPageSettings> : null; } catch { return null; }
}

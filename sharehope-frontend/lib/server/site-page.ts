import type { ManagedSitePageKey } from "@/types/website";
import type { Metadata } from "next";
import { fetchBackend } from "@/lib/server/backend-fetch";

export interface ManagedPageContent {
  title: string | null;
  subtitle: string | null;
  body: string | null;
  buttonText: string | null;
  settings: Record<string, unknown>;
}

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function getManagedPage(pageKey: ManagedSitePageKey, locale: string): Promise<ManagedPageContent | null> {
  try {
    const response = await fetchBackend(`${backendUrl}/api/public/website/pages/${pageKey}?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json() as { sections?: ManagedPageContent[] };
    return data.sections?.[0] ?? null;
  } catch {
    return null;
  }
}

export async function getManagedMetadata(pageKey: ManagedSitePageKey, locale: string, fallbackTitle: string, fallbackDescription?: string): Promise<Metadata> {
  const page = await getManagedPage(pageKey, locale);
  const title = typeof page?.settings.metaTitle === "string" && page.settings.metaTitle ? page.settings.metaTitle : fallbackTitle;
  const description = typeof page?.settings.metaDescription === "string" && page.settings.metaDescription ? page.settings.metaDescription : page?.body || fallbackDescription;
  const image = typeof page?.settings.socialImage === "string" && page.settings.socialImage ? page.settings.socialImage : undefined;
  const canonical = typeof page?.settings.canonicalUrl === "string" && page.settings.canonicalUrl ? page.settings.canonicalUrl : undefined;
  return { title, description, alternates: canonical ? { canonical } : undefined, openGraph: { title, description, images: image ? [image] : undefined } };
}

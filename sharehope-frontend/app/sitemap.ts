import type { MetadataRoute } from "next";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sharehope.org";
const routes = ["", "/about", "/about/our-story", "/about/founder", "/programs", "/education", "/health", "/community", "/events", "/blog", "/get-involved", "/volunteer", "/partner", "/partner/form", "/donate", "/contact", "/privacy"];

export default function sitemap(): MetadataRoute.Sitemap {
  return ["en", "fr"].flatMap((locale) => routes.map((route) => ({
    url: `${siteUrl}/${locale}${route}`,
    changeFrequency: route === "/events" || route === "/blog" ? "weekly" as const : "monthly" as const,
    priority: route === "" ? 1 : 0.7,
    alternates: { languages: { en: `${siteUrl}/en${route}`, fr: `${siteUrl}/fr${route}` } },
  })));
}

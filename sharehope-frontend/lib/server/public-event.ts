import type { PublicEvent } from "@/types/event";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function getPublicEvent(locale: string, slug: string) {
  const response = await fetchBackend(`${backendUrl}/api/public/events/${encodeURIComponent(slug)}?locale=${encodeURIComponent(locale)}`, { cache: "no-store" });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Event could not be loaded.");
  return response.json() as Promise<PublicEvent>;
}

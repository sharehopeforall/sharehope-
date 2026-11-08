import { rateLimited } from "@/lib/server/rate-limit";

export function publicFormRateLimited(request: Request, form: string) {
  if (process.env.NODE_ENV === "production" && form.startsWith("event-")
      && (!process.env.KV_REST_API_URL || !process.env.KV_REST_API_TOKEN)) {
    throw new Error("KV rate-limit storage is required for event registration in production");
  }
  return rateLimited(request, form, 10, 15 * 60 * 1000);
}

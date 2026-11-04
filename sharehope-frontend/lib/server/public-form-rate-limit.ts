import { rateLimited } from "@/lib/server/rate-limit";

export function publicFormRateLimited(request: Request, form: string) {
  return rateLimited(request, form, 10, 15 * 60 * 1000);
}

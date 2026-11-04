const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 10;
const attempts = new Map<string, { count: number; resetAt: number }>();

export function publicFormRateLimited(request: Request, form: string): boolean {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const client = forwarded || request.headers.get("x-real-ip") || "unknown";
  const key = `${form}:${client}`;
  const now = Date.now();
  const current = attempts.get(key);
  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  if (attempts.size > 10_000) {
    for (const [entryKey, entry] of attempts) if (entry.resetAt <= now) attempts.delete(entryKey);
  }
  return current.count > MAX_REQUESTS;
}

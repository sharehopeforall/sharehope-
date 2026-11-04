const buckets = new Map<string, { count: number; reset: number }>();

export async function rateLimited(request: Request, key: string, limit = 10, windowMs = 60_000) {
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip")
    || request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || "unknown";
  const id = `sharehope:limit:${key}:${ip}`;
  const url = process.env.KV_REST_API_URL;
  const token = process.env.KV_REST_API_TOKEN;
  if (url && token) {
    const response = await fetch(`${url}/pipeline`, { method: "POST", headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" }, body: JSON.stringify([["INCR", id], ["PEXPIRE", id, String(windowMs), "NX"]]), cache: "no-store" });
    if (!response.ok) throw new Error("Rate-limit service unavailable");
    const result = await response.json() as Array<{ result: number }>;
    return Number(result[0]?.result ?? limit + 1) > limit;
  }
  const now = Date.now(); const current = buckets.get(id);
  if (!current || current.reset < now) { buckets.set(id, { count: 1, reset: now + windowMs }); return false; }
  current.count += 1; return current.count > limit;
}

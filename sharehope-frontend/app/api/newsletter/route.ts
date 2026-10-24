import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";
const subscriptionSchema = z.object({
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  email: z.email().max(320),
  locale: z.enum(["en", "fr"]),
});

export async function POST(request: Request) {
  const parsed = subscriptionSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid subscription details." }, { status: 400 });

  try {
    const response = await fetchBackend(`${backendUrl}/api/public/newsletter/subscribe`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), cache: "no-store" }, 8_000);
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Subscription service unavailable." }, { status: 502 });
  }
}

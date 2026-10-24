import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";
const rsvpSchema = z.object({
  fullName: z.string().trim().min(1).max(160),
  email: z.union([z.email().max(320), z.literal(""), z.null()]).optional(),
  guestCount: z.number().int().min(1).max(10),
  passType: z.string().trim().min(1).max(160),
  registrationType: z.enum(["RSVP", "VOLUNTEER"]).optional(),
  locale: z.enum(["en", "fr"]),
});

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const parsed = rsvpSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid registration details." }, { status: 400 });

  try {
    const response = await fetchBackend(`${backendUrl}/api/public/events/${encodeURIComponent(slug)}/rsvp`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(parsed.data), cache: "no-store" }, 8_000);
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Registration service unavailable." }, { status: 502 });
  }
}

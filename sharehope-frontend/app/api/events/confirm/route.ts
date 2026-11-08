import { NextResponse } from "next/server";
import { fetchBackend } from "@/lib/server/backend-fetch";
import { publicFormRateLimited } from "@/lib/server/public-form-rate-limit";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function POST(request: Request) {
  try {
    if (await publicFormRateLimited(request, "event-confirmation")) {
      return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
    }
  } catch {
    return NextResponse.json({ error: "Confirmation protection is temporarily unavailable." }, { status: 503 });
  }
  const body = await request.json().catch(() => null) as { token?: unknown } | null;
  if (!body || typeof body.token !== "string" || !body.token || body.token.length > 200) {
    return NextResponse.json({ error: "Invalid confirmation link." }, { status: 400 });
  }
  try {
    const response = await fetchBackend(`${backendUrl}/api/public/events/registrations/confirm`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Public-Form-Secret": process.env.PUBLIC_FORM_INTERNAL_SECRET ?? "" },
      body: JSON.stringify({ token: body.token }),
      cache: "no-store",
    }, 10_000);
    const data = await response.json().catch(() => ({}));
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json({ error: "Confirmation service unavailable." }, { status: 502 });
  }
}

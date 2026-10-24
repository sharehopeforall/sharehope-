import { del } from "@vercel/blob";
import { NextResponse } from "next/server";
import { isAuthorizedAdmin } from "@/lib/server/admin-auth";

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { url } = (await request.json()) as { url?: string };

  if (!url) {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return NextResponse.json({ error: "Invalid blob URL" }, { status: 400 });
  }
  if (!parsed.hostname.endsWith(".public.blob.vercel-storage.com")) {
    return NextResponse.json({ error: "Unsupported blob URL" }, { status: 400 });
  }

  await del(url);

  return NextResponse.json({ success: true });
}

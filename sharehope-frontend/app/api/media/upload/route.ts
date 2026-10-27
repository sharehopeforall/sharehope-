import { randomUUID } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import sharp from "sharp";
import { isAuthorizedAdmin } from "@/lib/server/admin-auth";

export const runtime = "nodejs";

const ALLOWED_TYPES = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
  ["video/mp4", ".mp4"],
  ["video/webm", ".webm"],
  ["video/quicktime", ".mov"],
]);
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_FILE_SIZE = 250 * 1024 * 1024;
const MAX_IMAGE_DIMENSION = 1_920;

export async function POST(request: Request): Promise<NextResponse> {
  if (!(await isAuthorizedAdmin(request))) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "A media file is required." }, { status: 400 });
  }

  let extension = ALLOWED_TYPES.get(file.type);
  if (!extension) {
    return NextResponse.json({ error: "Unsupported media type." }, { status: 400 });
  }
  const isVideo = file.type.startsWith("video/");
  const sizeLimit = isVideo ? MAX_VIDEO_FILE_SIZE : MAX_FILE_SIZE;
  if (file.size > sizeLimit) {
    return NextResponse.json({ error: isVideo ? "Video must be smaller than 250 MB." : "Image must be smaller than 10 MB." }, { status: 400 });
  }

  const original = Buffer.from(await file.arrayBuffer());
  const shouldOptimize = !isVideo && file.type !== "image/gif";
  const storedFile = shouldOptimize
    ? await sharp(original)
        .rotate()
        .resize({ width: MAX_IMAGE_DIMENSION, height: MAX_IMAGE_DIMENSION, fit: "inside", withoutEnlargement: true })
        .webp({ quality: 82, effort: 4 })
        .toBuffer()
    : original;
  const contentType = shouldOptimize ? "image/webp" : file.type;
  if (shouldOptimize) extension = ".webp";
  const pathname = `uploads/${randomUUID()}${extension}`;

  const hasBlobCredentials = Boolean(
    process.env.BLOB_READ_WRITE_TOKEN ||
      (process.env.VERCEL === "1" && process.env.BLOB_STORE_ID),
  );

  if (hasBlobCredentials) {
    const blob = await put(pathname, storedFile, { access: "public", addRandomSuffix: false, contentType });
    return NextResponse.json({
      url: blob.url,
      pathname: blob.pathname,
      contentType,
    });
  }

  if (process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Persistent media storage is not configured." },
      { status: 503 },
    );
  }

  const uploadDirectory = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDirectory, { recursive: true });
  await writeFile(path.join(process.cwd(), "public", pathname), storedFile);

  return NextResponse.json({
    url: `/${pathname}`,
    pathname,
    contentType,
  });
}

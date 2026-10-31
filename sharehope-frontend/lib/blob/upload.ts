import type { UploadMediaResult } from "@/types/media";
import { getAccessToken } from "@/lib/auth/token";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_VIDEO_SIZE = 250 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
]);

interface UploadFileOptions {
  onProgress?: (percentage: number) => void;
}

async function uploadThroughServer(file: File, token: string): Promise<UploadMediaResult> {
  const formData = new FormData();
  formData.set("file", file);
  const response = await fetch("/api/media/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? `Media upload failed (${response.status}).`);
  }
  return response.json() as Promise<UploadMediaResult>;
}

export async function uploadFile(file: File, options: UploadFileOptions = {}): Promise<UploadMediaResult> {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Unsupported media type.");
  const isVideo = file.type.startsWith("video/");
  const sizeLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > sizeLimit) {
    throw new Error(isVideo ? "Video must be smaller than 250 MB." : "Image must be smaller than 10 MB.");
  }

  const token = getAccessToken() ?? "";
  options.onProgress?.(0);
  const result = await uploadThroughServer(file, token);
  options.onProgress?.(100);
  return result;
}

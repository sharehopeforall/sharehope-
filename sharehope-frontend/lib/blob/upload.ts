import type { UploadMediaResult } from "@/types/media";
import { getAccessToken } from "@/lib/auth/token";
import { upload } from "@vercel/blob/client";

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

export async function uploadFile(file: File, options: UploadFileOptions = {}): Promise<UploadMediaResult> {
  if (!ALLOWED_TYPES.has(file.type)) throw new Error("Unsupported media type.");
  const isVideo = file.type.startsWith("video/");
  const sizeLimit = isVideo ? MAX_VIDEO_SIZE : MAX_IMAGE_SIZE;
  if (file.size > sizeLimit) {
    throw new Error(isVideo ? "Video must be smaller than 250 MB." : "Image must be smaller than 10 MB.");
  }

  const token = getAccessToken() ?? "";
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "-") || (isVideo ? "video" : "image");
  const blob = await upload(`uploads/${safeName}`, file, {
    access: "public",
    handleUploadUrl: "/api/blob/upload",
    headers: { Authorization: `Bearer ${token}` },
    contentType: file.type,
    multipart: file.size > 5 * 1024 * 1024,
    onUploadProgress: ({ percentage }) => options.onProgress?.(Math.round(percentage)),
  });

  return { url: blob.url, pathname: blob.pathname, contentType: blob.contentType };
}

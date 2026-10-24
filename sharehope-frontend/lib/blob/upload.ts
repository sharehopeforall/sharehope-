import type { UploadMediaResult } from "@/types/media";
import { getAccessToken } from "@/lib/auth/token";

export async function uploadFile(file: File): Promise<UploadMediaResult> {
  const formData = new FormData();
  formData.set("file", file);

  const response = await fetch("/api/media/upload", {
    method: "POST",
    headers: { Authorization: `Bearer ${getAccessToken() ?? ""}` },
    body: formData,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(body?.error ?? "Media upload failed.");
  }

  return response.json() as Promise<UploadMediaResult>;
}

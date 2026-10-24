import { getAccessToken } from "@/lib/auth/token";

export async function deleteFile(url: string): Promise<void> {
  const response = await fetch("/api/blob/delete", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken() ?? ""}`,
    },
    body: JSON.stringify({ url }),
  });

  if (!response.ok) {
    throw new Error("Failed to delete file");
  }
}

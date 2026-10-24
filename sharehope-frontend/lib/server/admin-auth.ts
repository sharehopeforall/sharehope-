import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function isAuthorizedAdmin(request: Request): Promise<boolean> {
  const authorization = request.headers.get("authorization");
  if (!authorization?.startsWith("Bearer ")) return false;

  try {
    const response = await fetchBackend(
      `${backendUrl}/api/admin/website/homepage?locale=en`,
      {
        headers: { Authorization: authorization },
        cache: "no-store",
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

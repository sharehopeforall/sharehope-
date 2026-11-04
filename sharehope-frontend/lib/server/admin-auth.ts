import { fetchBackend } from "@/lib/server/backend-fetch";

const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";

export async function isAuthorizedAdmin(request: Request): Promise<boolean> {
  const origin = request.headers.get("origin");
  if (origin && origin !== new URL(request.url).origin) return false;
  const authorization = request.headers.get("authorization");
  const cookie = request.headers.get("cookie")
    ?.split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith("sharehope_session="))
    ?.slice("sharehope_session=".length);
  const bearer = authorization?.startsWith("Bearer ")
    ? authorization
    : cookie
      ? `Bearer ${decodeURIComponent(cookie)}`
      : null;
  if (!bearer) return false;

  try {
    const response = await fetchBackend(
      `${backendUrl}/api/admin/website/homepage?locale=en`,
      {
        headers: { Authorization: bearer },
        cache: "no-store",
      },
    );
    return response.ok;
  } catch {
    return false;
  }
}

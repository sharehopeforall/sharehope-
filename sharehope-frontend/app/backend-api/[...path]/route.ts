import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE = "sharehope_session";
const backendUrl = process.env.BACKEND_URL ?? "http://localhost:8080";
const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

function cookieOptions(maxAge?: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    ...(maxAge === undefined ? {} : { maxAge }),
  };
}

function validOrigin(request: NextRequest) {
  if (!MUTATING_METHODS.has(request.method)) return true;
  const origin = request.headers.get("origin");
  return !origin || origin === request.nextUrl.origin;
}

async function proxy(request: NextRequest, context: RouteContext<"/backend-api/[...path]">) {
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid request origin." }, { status: 403 });
  }

  const { path } = await context.params;
  const backendPath = path.join("/");
  const target = new URL(`/api/${backendPath}${request.nextUrl.search}`, backendUrl);
  const headers = new Headers();
  const contentType = request.headers.get("content-type");
  if (contentType) headers.set("content-type", contentType);

  const token = request.cookies.get(SESSION_COOKIE)?.value;
  if (token) headers.set("authorization", `Bearer ${token}`);

  const response = await fetch(target, {
    method: request.method,
    headers,
    body: request.method === "GET" || request.method === "HEAD" ? undefined : await request.arrayBuffer(),
    cache: "no-store",
    signal: AbortSignal.timeout(10_000),
  });

  if (backendPath === "auth/login" && response.ok) {
    const session = (await response.json()) as {
      accessToken: string;
      expiresIn: number;
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      role: "SUPER_ADMIN" | "CONTENT_EDITOR";
    };
    const result = NextResponse.json({
      id: session.userId,
      firstName: session.firstName,
      lastName: session.lastName,
      email: session.email,
      role: session.role,
    });
    result.cookies.set(SESSION_COOKIE, session.accessToken, cookieOptions(session.expiresIn));
    return result;
  }

  if (backendPath === "auth/me" && response.ok) {
    const session = (await response.json()) as {
      userId: string;
      firstName: string;
      lastName: string;
      email: string;
      role: "SUPER_ADMIN" | "CONTENT_EDITOR";
    };
    return NextResponse.json({
      id: session.userId,
      firstName: session.firstName,
      lastName: session.lastName,
      email: session.email,
      role: session.role,
    });
  }

  if (backendPath === "auth/logout") {
    const result = new NextResponse(null, { status: 204 });
    result.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
    return result;
  }

  const result = new NextResponse(response.body, {
    status: response.status,
    headers: { "content-type": response.headers.get("content-type") ?? "application/json" },
  });
  if (response.status === 401) result.cookies.set(SESSION_COOKIE, "", cookieOptions(0));
  return result;
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;

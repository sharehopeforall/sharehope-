import type { AuthSession, User } from "@/types/user";

const SESSION_KEY = "sharehope_session";

export function getSession(): AuthSession | null {
  if (typeof window === "undefined") return null;

  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return null;

  try {
    const session = JSON.parse(raw) as AuthSession;
    const payloadPart = session.accessToken.split(".")[1];
    if (!payloadPart) {
      clearSession();
      return null;
    }

    const base64 = payloadPart.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(atob(paddedBase64)) as {
      exp?: number;
    };
    if (!payload.exp || payload.exp * 1000 <= Date.now()) {
      clearSession();
      return null;
    }

    return session;
  } catch {
    clearSession();
    return null;
  }
}

export function getAccessToken(): string | null {
  return getSession()?.accessToken ?? null;
}

export function sessionToUser(session: AuthSession): User {
  return {
    id: session.userId,
    firstName: session.firstName,
    lastName: session.lastName,
    email: session.email,
    role: session.role,
  };
}

export function getCurrentUser(): User | null {
  const session = getSession();
  return session ? sessionToUser(session) : null;
}

export function setSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
}

export function clearSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_KEY);
}

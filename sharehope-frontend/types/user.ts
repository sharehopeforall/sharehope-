export type AdminRole = "SUPER_ADMIN" | "CONTENT_EDITOR";

/**
 * Shape returned by POST /api/auth/login. There is no refresh token and no
 * GET /me endpoint on the backend - this is the only place user identity
 * comes from, so it's cached in full (see lib/auth/token.ts).
 */
export interface AuthSession {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
}

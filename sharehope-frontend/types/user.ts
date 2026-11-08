export type AdminRole = "SUPER_ADMIN" | "CONTENT_EDITOR";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
}

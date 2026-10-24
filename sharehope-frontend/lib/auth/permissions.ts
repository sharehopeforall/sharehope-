import type { AdminRole, User } from "@/types/user";

const ROLE_HIERARCHY: Record<AdminRole, number> = {
  CONTENT_EDITOR: 0,
  SUPER_ADMIN: 1,
};

export function hasRole(user: User | null | undefined, role: AdminRole): boolean {
  if (!user) return false;
  return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[role];
}

export function canEditContent(user: User | null | undefined): boolean {
  return hasRole(user, "CONTENT_EDITOR");
}

export function canManageUsers(user: User | null | undefined): boolean {
  return hasRole(user, "SUPER_ADMIN");
}

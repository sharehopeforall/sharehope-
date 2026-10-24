import { apiClient } from "@/lib/api/client";
import type { AdminRole } from "@/types/user";

export interface InviteUserInput {
  firstName: string;
  lastName: string;
  email: string;
  role: AdminRole;
}

export interface InviteUserResult {
  message: string;
  userId: string;
  email: string;
  status: string;
  role: string;
  invitationToken: string;
}

/**
 * The backend currently only exposes the invite endpoint for admin user
 * management (POST /api/admin/users/invite, SUPER_ADMIN only). There is no
 * GET /users/me, GET /users, PUT /users/{id} or DELETE /users/{id} yet.
 */
export const usersApi = {
  invite: (data: InviteUserInput) =>
    apiClient.post<InviteUserResult>("/admin/users/invite", data),
};

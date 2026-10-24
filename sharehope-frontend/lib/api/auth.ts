import { apiClient } from "@/lib/api/client";
import type { AuthSession } from "@/types/user";

interface ActivateResponse {
  message: string;
  userId: string;
  email: string;
  status: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<AuthSession>("/auth/login", { email, password }, { auth: false }),
  activate: (token: string, password: string) =>
    apiClient.post<ActivateResponse>("/auth/activate", { token, password }, { auth: false }),
};

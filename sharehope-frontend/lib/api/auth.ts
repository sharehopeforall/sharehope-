import { apiClient } from "@/lib/api/client";
import type { User } from "@/types/user";

interface ActivateResponse {
  message: string;
  userId: string;
  email: string;
  status: string;
}

export const authApi = {
  login: (email: string, password: string) =>
    apiClient.post<User>("/auth/login", { email, password }, { auth: false }),
  currentUser: () => apiClient.get<User>("/auth/me"),
  logout: () => apiClient.post<void>("/auth/logout"),
  activate: (token: string, password: string) =>
    apiClient.post<ActivateResponse>("/auth/activate", { token, password }, { auth: false }),
};

import { apiClient } from "@/lib/api/client";
import type { User } from "@/types/user";

interface ActivateResponse {
  message: string;
  userId: string;
  email: string;
  status: string;
}

export const authApi = {
  login: (email: string, password: string, mfaCode = "") =>
    apiClient.post<User>("/auth/login", { email, password, mfaCode }, { auth: false }),
  currentUser: () => apiClient.get<User>("/auth/me"),
  logout: () => apiClient.post<void>("/auth/logout"),
  forgotPassword: (email: string) => apiClient.post<{ message: string }>("/auth/forgot-password", { email }, { auth: false }),
  resetPassword: (token: string, password: string) => apiClient.post<{ message: string }>("/auth/reset-password", { token, password }, { auth: false }),
  changePassword: (currentPassword: string, newPassword: string) => apiClient.post<void>("/auth/change-password", { currentPassword, newPassword }),
  changeEmail: (email: string, currentPassword: string) => apiClient.post<void>("/auth/change-email", { email, currentPassword }),
  mfaStatus: () => apiClient.get<{ enabled: boolean }>("/auth/mfa/status"),
  setupMfa: () => apiClient.post<{ secret: string; otpauthUri: string }>("/auth/mfa/setup"),
  enableMfa: (code: string) => apiClient.post<void>("/auth/mfa/enable", { code }),
  disableMfa: (code: string) => apiClient.post<void>("/auth/mfa/disable", { code }),
  activate: (token: string, password: string) =>
    apiClient.post<ActivateResponse>("/auth/activate", { token, password }, { auth: false }),
};

"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import type { User } from "@/types/user";

const CURRENT_USER_KEY = ["auth", "currentUser"];

/**
 * Identity is verified by the backend from the HttpOnly session cookie.
 */
export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: CURRENT_USER_KEY,
    queryFn: async () => {
      try {
        return await authApi.currentUser();
      } catch {
        return null;
      }
    },
    staleTime: 60_000,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password, mfaCode = "" }: { email: string; password: string; mfaCode?: string }) =>
      authApi.login(email, password, mfaCode),
    onSuccess: (user) => {
      queryClient.setQueryData<User>(CURRENT_USER_KEY, user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return async () => {
    await authApi.logout().catch(() => undefined);
    queryClient.setQueryData(CURRENT_USER_KEY, null);
  };
}

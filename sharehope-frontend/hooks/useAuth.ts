"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { clearSession, getCurrentUser, sessionToUser, setSession } from "@/lib/auth/token";
import type { User } from "@/types/user";

const CURRENT_USER_KEY = ["auth", "currentUser"];

/**
 * There is no GET /me endpoint on the backend - identity comes entirely
 * from what POST /api/auth/login returned, cached in localStorage. This
 * query never hits the network; it just gives every component a reactive,
 * shared view of that cached session via the react-query cache.
 */
export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: CURRENT_USER_KEY,
    queryFn: () => getCurrentUser(),
    staleTime: Infinity,
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: (session) => {
      setSession(session);
      queryClient.setQueryData<User>(CURRENT_USER_KEY, sessionToUser(session));
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return () => {
    clearSession();
    queryClient.setQueryData(CURRENT_USER_KEY, null);
  };
}

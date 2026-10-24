"use client";

import { useEffect } from "react";
import { useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/admin/login");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return null;
  }

  return <>{children}</>;
}

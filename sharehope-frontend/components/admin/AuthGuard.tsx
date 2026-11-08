"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useCurrentUser } from "@/hooks/useAuth";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { data: user, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/admin/login");
    } else if (!isLoading && user?.mfaSetupRequired && pathname !== "/admin/settings") {
      router.replace("/admin/settings");
    }
  }, [isLoading, user, pathname, router]);

  if (isLoading || !user || (user.mfaSetupRequired && pathname !== "/admin/settings")) {
    return null;
  }

  return <>{children}</>;
}

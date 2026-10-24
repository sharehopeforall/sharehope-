"use client";

import { usePathname } from "@/i18n/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { AuthGuard } from "@/components/admin/AuthGuard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return <div className="flex min-h-full flex-1">{children}</div>;
  }

  return (
    <AuthGuard>
      <div className="h-dvh min-h-0 flex-1 overflow-hidden">
        <Sidebar />
        <main className="mt-[65px] h-[calc(100dvh-65px)] min-w-0 overflow-y-auto overscroll-contain md:ml-64">{children}</main>
      </div>
    </AuthGuard>
  );
}

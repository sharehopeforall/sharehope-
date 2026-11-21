"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import {
  Globe,
  LayoutDashboard,
  HeartHandshake,
  CalendarDays,
  CircleDollarSign,
  Users2,
  Newspaper,
  Inbox,
  Mail,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useCurrentUser, useLogout } from "@/hooks/useAuth";

export function Sidebar() {
  const t = useTranslations("Admin");
  const { data: user } = useCurrentUser();
  const logout = useLogout();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const owner = user?.role === "SUPER_ADMIN";

  const managementLinks = [
    ...(owner ? [
      { href: "/admin/donations", label: "Donations", icon: CircleDollarSign },
      { href: "/admin/submissions", label: "Applications", icon: Inbox },
      { href: "/admin/subscribers", label: "Newsletter", icon: Mail },
    ] : []),
    { href: "/admin/programs", label: t("programs"), icon: HeartHandshake },
    { href: "/admin/events", label: t("events"), icon: CalendarDays },
    ...(owner ? [{ href: "/admin/team", label: t("team"), icon: Users2 }] : []),
    { href: "/admin/blog", label: t("blog"), icon: Newspaper },
    { href: "/admin/settings", label: t("settings"), icon: Settings },
  ];
  const groups = [
    { label: "Overview", links: [{ href: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard }] },
    { label: "Website", links: [{ href: "/admin/website", label: "Visual Editor", icon: Globe }] },
    { label: "Manage", links: managementLinks },
  ];

  const navigation = (close?: () => void) => <>
      <div className="px-4 py-6 text-lg font-semibold">ShareHope Admin</div>
      <nav className="flex min-h-0 flex-1 flex-col gap-5 overflow-y-auto px-2 pb-4">
        {groups.map((group) => <div key={group.label}><p className="px-3 pb-1.5 text-[10px] font-black uppercase tracking-[.18em] text-slate-400">{group.label}</p><div className="space-y-1">{group.links.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href === "/admin/settings" && pathname === "/admin/users");
          return <Link onClick={close} key={href} href={href} aria-current={active ? "page" : undefined} className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-green ${active ? "bg-brand-navy font-semibold text-white" : "hover:bg-muted"}`}><Icon className="h-4 w-4" />{label}</Link>;
        })}</div></div>)}
      </nav>
      {user && (
        <div className="shrink-0 border-t bg-background/60 px-4 py-4 text-sm">
          <div className="mb-2 font-medium">
            {user.firstName} {user.lastName}
          </div>
          <div className="mb-3 text-xs text-muted-foreground">{user.role}</div>
          <button
            type="button"
            onClick={() => { close?.(); logout(); }}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      )}
  </>;

  return <>
    <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open admin navigation" aria-expanded={mobileOpen} className="fixed left-3 top-3 z-[80] grid h-10 w-10 place-items-center rounded-lg border bg-white text-brand-navy shadow-sm md:hidden"><Menu className="h-5 w-5"/></button>
    <aside className="fixed inset-y-0 left-0 z-[70] hidden w-64 flex-col overflow-hidden border-r bg-muted/30 md:flex">{navigation()}</aside>
    {mobileOpen && <div className="fixed inset-0 z-[100] md:hidden">
      <button type="button" aria-label="Close admin navigation" onClick={() => setMobileOpen(false)} className="absolute inset-0 bg-slate-950/45"/>
      <aside role="dialog" aria-modal="true" aria-label="Admin navigation" className="relative flex h-full w-[min(86vw,320px)] flex-col overflow-hidden bg-white shadow-2xl">
        <button type="button" onClick={() => setMobileOpen(false)} aria-label="Close admin navigation" className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-lg hover:bg-slate-100"><X className="h-5 w-5"/></button>
        {navigation(() => setMobileOpen(false))}
      </aside>
    </div>}
  </>;
}

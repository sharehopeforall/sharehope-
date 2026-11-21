"use client";

import {useEffect, useRef, useState} from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {Bell, CheckCheck, CircleAlert, Gift, HandHeart, CalendarCheck, X} from "lucide-react";
import {usePathname, useRouter} from "next/navigation";
import {notificationApi, type AdminNotification} from "@/lib/api/notifications";

const key = ["admin-notifications"];

function relativeTime(value: string) {
  const seconds = Math.round((new Date(value).getTime() - Date.now()) / 1000);
  const ranges: [number, Intl.RelativeTimeFormatUnit][] = [[60, "second"], [60, "minute"], [24, "hour"], [7, "day"]];
  let amount = seconds;
  for (const [limit, unit] of ranges) {
    if (Math.abs(amount) < limit) return new Intl.RelativeTimeFormat(undefined, {numeric: "auto"}).format(Math.round(amount), unit);
    amount /= limit;
  }
  return new Intl.RelativeTimeFormat(undefined, {numeric: "auto"}).format(Math.round(amount / 4.345), "month");
}

function ItemIcon({item}: {item: AdminNotification}) {
  const props = {className: "h-4 w-4", "aria-hidden": true as const};
  if (item.type === "DONATION") return <Gift {...props}/>;
  if (item.type === "APPLICATION") return <HandHeart {...props}/>;
  if (item.type === "EVENT_REGISTRATION") return <CalendarCheck {...props}/>;
  return <CircleAlert {...props}/>;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] === "fr" ? "fr" : "en";
  const feed = useQuery({queryKey: key, queryFn: notificationApi.list, refetchInterval: 30_000});
  const refresh = () => queryClient.invalidateQueries({queryKey: key});
  const read = useMutation({mutationFn: notificationApi.read, onSuccess: refresh});
  const readAll = useMutation({mutationFn: notificationApi.readAll, onSuccess: refresh});

  useEffect(() => {
    const close = (event: MouseEvent) => { if (!root.current?.contains(event.target as Node)) setOpen(false); };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("mousedown", close); document.removeEventListener("keydown", escape); };
  }, []);

  const select = async (item: AdminNotification) => {
    if (!item.readAt) await read.mutateAsync(item.id);
    setOpen(false);
    if (item.actionUrl) router.push(`/${locale}${item.actionUrl}`);
  };

  const count = feed.data?.unreadCount ?? 0;
  return <div className="relative" ref={root}>
    <button type="button" onClick={() => setOpen(value => !value)} aria-label={`Notifications${count ? `, ${count} unread` : ""}`}
      aria-expanded={open} className="relative grid h-10 w-10 place-items-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#FFC72C]">
      <Bell className="h-5 w-5" aria-hidden="true"/>
      {count > 0 && <span className="absolute -right-1 -top-1 min-w-5 rounded-full bg-red-600 px-1.5 py-0.5 text-center text-[10px] font-bold leading-4 text-white">{count > 99 ? "99+" : count}</span>}
    </button>
    {open && <section aria-label="Notifications" className="absolute right-0 top-12 z-[90] w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <div><h2 className="font-semibold text-slate-900">Notifications</h2><p className="text-xs text-slate-500">{count ? `${count} unread` : "You’re all caught up"}</p></div>
        <div className="flex items-center gap-1">
          {count > 0 && <button type="button" onClick={() => readAll.mutate()} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Mark all as read"><CheckCheck className="h-4 w-4"/></button>}
          <button type="button" onClick={() => setOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100" aria-label="Close notifications"><X className="h-4 w-4"/></button>
        </div>
      </div>
      <div className="max-h-[min(65vh,520px)] overflow-y-auto">
        {feed.isLoading && <p className="p-6 text-center text-sm text-slate-500">Loading notifications…</p>}
        {feed.isError && <button type="button" onClick={() => feed.refetch()} className="w-full p-6 text-sm text-red-700">Could not load notifications. Try again.</button>}
        {feed.data?.items.length === 0 && <div className="p-8 text-center"><Bell className="mx-auto mb-3 h-7 w-7 text-slate-300"/><p className="text-sm font-medium text-slate-700">No notifications yet</p><p className="mt-1 text-xs text-slate-500">New activity will appear here.</p></div>}
        {feed.data?.items.map(item => <button key={item.id} type="button" onClick={() => select(item)} className={`flex w-full gap-3 border-b border-slate-100 px-4 py-3 text-left transition hover:bg-slate-50 ${item.readAt ? "bg-white" : "bg-amber-50/70"}`}>
          <span className={`mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full ${item.severity === "SUCCESS" ? "bg-emerald-100 text-emerald-700" : "bg-blue-100 text-blue-700"}`}><ItemIcon item={item}/></span>
          <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{item.title}</span><span className="mt-0.5 block text-xs leading-5 text-slate-600">{item.message}</span><span className="mt-1 block text-[11px] text-slate-400">{relativeTime(item.createdAt)}</span></span>
          {!item.readAt && <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-blue-600" aria-label="Unread"/>}
        </button>)}
      </div>
    </section>}
  </div>;
}

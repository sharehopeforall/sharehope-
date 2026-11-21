import {NotificationBell} from "./NotificationBell";

export function AdminHeader({ title }: { title: string }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-[60] flex h-[65px] items-center justify-between border-b bg-white/95 px-6 py-4 shadow-sm backdrop-blur md:left-64">
      <h1 className="pl-11 text-xl font-semibold md:pl-0">{title}</h1>
      <div className="flex items-center gap-3">
        <span className="hidden text-xs font-bold uppercase tracking-[.16em] text-slate-400 sm:inline">ShareHope CMS</span>
        <NotificationBell />
      </div>
    </header>
  );
}

import { ArrowRight, UsersRound } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Link } from "@/i18n/navigation";

export default function AdminSettingsPage() {
  return (
    <>
      <AdminHeader title="Settings" />
      <main className="mx-auto w-full max-w-5xl p-6 sm:p-8 lg:p-10">
        <div>
          <h1 className="font-serif text-3xl font-semibold text-brand-navy">Workspace settings</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Manage your organization and administrative access.</p>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="grid gap-5 p-6 sm:grid-cols-[1fr_auto] sm:items-center sm:p-7">
            <div className="flex gap-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EFF6FF] text-brand-green"><UsersRound size={20} aria-hidden="true" /></div>
              <div><h2 className="font-semibold text-brand-navy">Administrators</h2><p className="mt-1 text-sm leading-6 text-slate-600">Manage who can access the admin and assign their role.</p></div>
            </div>
            <Link href="/admin/users" className="inline-flex items-center gap-2 text-sm font-bold text-brand-navy transition hover:text-brand-green">Manage <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </section>
      </main>
    </>
  );
}

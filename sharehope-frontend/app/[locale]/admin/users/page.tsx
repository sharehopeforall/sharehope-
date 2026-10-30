"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, FilePenLine, Loader2, MailPlus, ShieldCheck, UserRoundPlus } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useCurrentUser } from "@/hooks/useAuth";
import { usersApi, type InviteUserResult } from "@/lib/api/users";
import type { AdminRole } from "@/types/user";

const fieldClass = "mt-2 h-11 w-full rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-brand-navy outline-none transition focus:border-brand-green focus:ring-4 focus:ring-brand-green/10";

export default function AdminUsersPage() {
  const currentUser = useCurrentUser().data;
  const [role, setRole] = useState<AdminRole>("CONTENT_EDITOR");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<InviteUserResult | null>(null);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true); setError(""); setResult(null);
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    try {
      const invitation = await usersApi.invite({
        firstName: String(form.get("firstName") ?? "").trim(),
        lastName: String(form.get("lastName") ?? "").trim(),
        email: String(form.get("email") ?? "").trim(),
        role,
      });
      setResult(invitation);
      formElement.reset();
      setRole("CONTENT_EDITOR");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "The invitation could not be created.");
    } finally { setPending(false); }
  };

  return (
    <>
      <AdminHeader title="Administrators" />
      <main className="mx-auto grid w-full max-w-6xl gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:p-10">
        <section>
          <p className="font-mono-spaced text-[11px] font-bold uppercase tracking-[.2em] text-brand-green">Access management</p>
          <h1 className="font-serif mt-2 text-3xl font-semibold text-brand-navy">Invite an administrator</h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">Add a trusted team member and assign the access level that matches their responsibilities.</p>

          <form onSubmit={submit} className="mt-8 space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-semibold text-brand-navy">First name<input name="firstName" required autoComplete="given-name" className={fieldClass} /></label>
              <label className="text-sm font-semibold text-brand-navy">Last name<input name="lastName" required autoComplete="family-name" className={fieldClass} /></label>
            </div>
            <label className="block text-sm font-semibold text-brand-navy">Email address<input name="email" type="email" required autoComplete="email" placeholder="name@sharehope.org" className={fieldClass} /></label>

            <fieldset>
              <legend className="text-sm font-semibold text-brand-navy">Role</legend>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => setRole("CONTENT_EDITOR")} aria-pressed={role === "CONTENT_EDITOR"} className={`rounded-xl border p-4 text-left transition ${role === "CONTENT_EDITOR" ? "border-brand-green bg-[#FFF0E8] ring-2 ring-brand-green/10" : "border-slate-200 hover:border-slate-300"}`}><FilePenLine size={19} className="text-brand-green" aria-hidden="true" /><span className="mt-3 block text-sm font-bold text-brand-navy">Content Editor</span><span className="mt-1 block text-xs leading-5 text-slate-500">Creates and updates website content and events.</span></button>
                <button type="button" onClick={() => setRole("SUPER_ADMIN")} aria-pressed={role === "SUPER_ADMIN"} className={`rounded-xl border p-4 text-left transition ${role === "SUPER_ADMIN" ? "border-brand-orange bg-orange-50 ring-2 ring-brand-orange/10" : "border-slate-200 hover:border-slate-300"}`}><ShieldCheck size={19} className="text-brand-orange" aria-hidden="true" /><span className="mt-3 block text-sm font-bold text-brand-navy">Super Administrator</span><span className="mt-1 block text-xs leading-5 text-slate-500">Full access, including publishing and users.</span></button>
              </div>
            </fieldset>

            {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-800">{error}</p>}
            {result && <div role="status" className="flex gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-900"><CheckCircle2 size={19} className="mt-0.5 shrink-0" aria-hidden="true" /><div><p className="font-bold">Invitation created</p><p className="mt-0.5">{result.email} was added as {result.role === "SUPER_ADMIN" ? "a Super Administrator" : "a Content Editor"}.</p></div></div>}

            <button type="submit" disabled={pending} className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-navy px-5 text-sm font-bold text-white transition hover:bg-[#173A59] disabled:cursor-wait disabled:opacity-60">{pending ? <Loader2 className="animate-spin" size={17} aria-hidden="true" /> : <MailPlus size={17} aria-hidden="true" />}{pending ? "Creating invitation…" : "Invite administrator"}</button>
          </form>
        </section>

        <aside className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF0E8] text-brand-green"><UserRoundPlus size={20} aria-hidden="true" /></div>
            <h2 className="mt-4 font-semibold text-brand-navy">Signed-in administrator</h2>
            <p className="mt-3 text-sm font-bold text-slate-800">{currentUser ? `${currentUser.firstName} ${currentUser.lastName}` : "Loading…"}</p>
            {currentUser && <><p className="mt-1 break-all text-xs text-slate-500">{currentUser.email}</p><span className="mt-4 inline-flex rounded-full bg-slate-100 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">{currentUser.role === "SUPER_ADMIN" ? "Super Administrator" : "Content Editor"}</span></>}
          </div>
          <div className="rounded-2xl bg-brand-navy p-6 text-white"><h2 className="font-semibold">Choose roles carefully</h2><p className="mt-2 text-sm leading-6 text-white/70">Only Super Administrators can invite users or publish website changes. Give this role only to trusted account owners.</p></div>
        </aside>
      </main>
    </>
  );
}

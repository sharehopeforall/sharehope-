"use client";

import { useEffect, useState, type FormEvent } from "react";
import { ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";

export function MfaCard() {
  const [enabled, setEnabled] = useState<boolean | null>(null);
  const [setup, setSetup] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);
  const logout = useLogout();
  const router = useRouter();

  useEffect(() => { authApi.mfaStatus().then((value) => setEnabled(value.enabled)).catch(() => setMessage("MFA status could not be loaded.")); }, []);

  async function start() {
    setPending(true); setMessage("");
    try { setSetup(await authApi.setupMfa()); } catch (error) { setMessage(error instanceof ApiError ? error.message : "Setup could not be started."); }
    finally { setPending(false); }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); const code = String(new FormData(event.currentTarget).get("code") || "");
    if (!/^\d{6}$/.test(code)) { setMessage("Enter the six-digit code from your authenticator app."); return; }
    setPending(true); setMessage("");
    try {
      if (enabled) await authApi.disableMfa(code); else await authApi.enableMfa(code);
      await logout(); router.replace("/admin/login");
    } catch (error) { setMessage(error instanceof ApiError ? error.message : "The code could not be verified."); setPending(false); }
  }

  return <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
    <div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><ShieldCheck size={20}/></div>
      <div className="w-full"><h2 className="font-semibold text-brand-navy">Authenticator app</h2>
        <p className="mt-1 text-sm text-slate-600">Protect the owner account with a six-digit code in addition to its password.</p>
        {enabled === false && !setup && <button onClick={start} disabled={pending} className="mt-5 rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">Set up authenticator</button>}
        {setup && <div className="mt-5 rounded-xl bg-slate-50 p-4 text-sm"><p>In Google Authenticator, Microsoft Authenticator, or 1Password, add an account using this setup key:</p><code className="mt-3 block break-all rounded bg-white p-3 font-bold tracking-widest">{setup.secret}</code><p className="mt-2 text-xs text-slate-500">Account: ShareHope administrator · Type: time based</p></div>}
        {(setup || enabled) && <form onSubmit={submit} className="mt-4 flex max-w-md flex-wrap gap-3"><input name="code" required inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="123456" className="h-11 min-w-40 flex-1 rounded-lg border px-3 tracking-[.3em]"/><button disabled={pending} className={`rounded-lg px-5 text-sm font-bold text-white disabled:opacity-50 ${enabled ? "bg-red-700" : "bg-brand-navy"}`}>{enabled ? "Disable MFA" : "Verify and enable"}</button></form>}
        {enabled && <p className="mt-3 text-sm font-semibold text-emerald-700">MFA is enabled. Disabling it requires a current authenticator code.</p>}
        {message && <p className="mt-3 text-sm font-semibold text-red-700">{message}</p>}
      </div></div>
  </section>;
}

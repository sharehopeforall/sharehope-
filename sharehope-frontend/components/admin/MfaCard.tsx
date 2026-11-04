"use client";

import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { authApi } from "@/lib/api/auth";

export function MfaCard() {
  const [setup, setSetup] = useState<{ secret: string; otpauthUri: string } | null>(null);
  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  async function begin() { setBusy(true); setMessage(""); try { setSetup(await authApi.setupMfa()); } catch { setMessage("MFA setup could not be started."); } finally { setBusy(false); } }
  async function enable() { setBusy(true); setMessage(""); try { await authApi.enableMfa(code); setMessage("Authenticator MFA is enabled. Sign in again to continue."); setSetup(null); setCode(""); } catch { setMessage("That authenticator code is invalid."); } finally { setBusy(false); } }
  async function disable() { setBusy(true); setMessage(""); try { await authApi.disableMfa(code); setMessage("Authenticator MFA is disabled. Sign in again to continue."); setCode(""); } catch { setMessage("Enter a valid current authenticator code."); } finally { setBusy(false); } }
  return <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
    <div className="flex gap-4"><div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-navy"><ShieldCheck size={20}/></div><div><h2 className="font-semibold text-brand-navy">Authenticator MFA</h2><p className="mt-1 text-sm leading-6 text-slate-600">Protect your administrator account with a six-digit authenticator code.</p></div></div>
    {!setup && <button disabled={busy} onClick={begin} className="mt-5 rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">Set up authenticator</button>}
    {setup && <div className="mt-5 space-y-4 rounded-xl bg-slate-50 p-4"><p className="text-sm text-slate-700">Add this account to your authenticator app using the setup link or secret:</p><a className="block break-all text-sm font-semibold text-blue-700 underline" href={setup.otpauthUri}>Open authenticator setup</a><code className="block break-all rounded bg-white p-3 text-sm">{setup.secret}</code><input value={code} onChange={(event)=>setCode(event.target.value.replace(/\D/g,"").slice(0,6))} inputMode="numeric" autoComplete="one-time-code" placeholder="Six-digit code" className="h-11 w-full rounded-xl border border-slate-300 px-3"/><button disabled={busy||code.length!==6} onClick={enable} className="rounded-xl bg-brand-navy px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60">Verify and enable</button></div>}
    <div className="mt-5 flex gap-2"><input value={setup?"":code} onChange={(event)=>setCode(event.target.value.replace(/\D/g,"").slice(0,6))} disabled={Boolean(setup)} inputMode="numeric" placeholder="Current code to disable" className="h-10 rounded-xl border border-slate-300 px-3 text-sm disabled:hidden"/><button onClick={disable} disabled={busy||Boolean(setup)||code.length!==6} className="rounded-xl border border-red-200 px-3 text-sm font-semibold text-red-700 disabled:hidden">Disable MFA</button></div>
    {message && <p role="status" className="mt-4 text-sm font-medium text-slate-700">{message}</p>}
  </section>;
}

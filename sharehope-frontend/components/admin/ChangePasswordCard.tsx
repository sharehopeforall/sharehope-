"use client";

import { useState, type FormEvent } from "react";
import { Eye, EyeOff, KeyRound } from "lucide-react";
import { authApi } from "@/lib/api/auth";
import { useLogout } from "@/hooks/useAuth";
import { useRouter } from "@/i18n/navigation";

export function ChangePasswordCard() {
  const logout = useLogout();
  const router = useRouter();
  const [state, setState] = useState<"idle" | "pending" | "error">("idle");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("current") || "");
    const newPassword = String(form.get("next") || "");
    if (newPassword !== String(form.get("confirm") || "")) {
      setState("error");
      return;
    }
    setState("pending");
    try {
      await authApi.changePassword(currentPassword, newPassword);
      await logout();
      router.replace("/admin/login");
    } catch {
      setState("error");
    }
  }

  return (
    <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
      <div className="flex gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-brand-navy"><KeyRound size={20} /></div>
        <div className="w-full">
          <h2 className="font-semibold text-brand-navy">Change password</h2>
          <p className="mt-1 text-sm text-slate-600">Changing your password signs out every active session.</p>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <PasswordField name="current" label="Current password" autoComplete="current-password" />
            <PasswordField name="next" label="New password" autoComplete="new-password" />
            <PasswordField name="confirm" label="Confirm new password" autoComplete="new-password" />
            {state === "error" && <p className="text-sm font-semibold text-red-700">Check your current password and ensure the new passwords match.</p>}
            <button disabled={state === "pending"} className="w-fit rounded-lg bg-brand-navy px-5 py-2.5 text-sm font-bold text-white disabled:opacity-50">{state === "pending" ? "Updating…" : "Update password"}</button>
          </form>
        </div>
      </div>
    </section>
  );
}

function PasswordField({ name, label, autoComplete }: { name: string; label: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <label className="text-sm font-semibold text-brand-navy">
      {label}
      <span className="relative mt-1.5 block max-w-md">
        <input name={name} required minLength={name === "current" ? 1 : 12} maxLength={128} type={visible ? "text" : "password"} autoComplete={autoComplete} className="h-11 w-full rounded-lg border px-3 pr-11 font-normal" />
        <button type="button" onClick={() => setVisible((value) => !value)} aria-label={`${visible ? "Hide" : "Show"} ${label.toLowerCase()}`} className="absolute inset-y-0 right-0 grid w-11 place-items-center text-slate-500 transition hover:text-brand-navy">
          {visible ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
        </button>
      </span>
    </label>
  );
}

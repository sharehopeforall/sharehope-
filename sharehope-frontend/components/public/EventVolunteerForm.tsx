"use client";

import { useState, type FormEvent } from "react";
import type { PublicEvent } from "@/types/event";

export function EventVolunteerForm({ event, locale }: { event: PublicEvent; locale: string }) {
  const isFrench = locale === "fr";
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    const formElement = e.currentTarget;
    const form = new FormData(formElement);
    const response = await fetch(`/api/events/${encodeURIComponent(event.slug)}/rsvp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fullName: form.get("fullName"),
        email: form.get("email"),
        guestCount: 1,
        passType: `Volunteer — ${form.get("role")}`,
        registrationType: "VOLUNTEER",
        locale,
      }),
    });

    const result = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(result.message ?? (isFrench ? "L’inscription n’a pas pu être enregistrée." : "Your volunteer registration could not be saved."));
      setStatus("error");
      return;
    }
    setMessage(isFrench ? "Merci! Votre place de bénévole est confirmée." : "Thank you! Your volunteer place is confirmed.");
    setStatus("success");
    formElement.reset();
  }

  if (status === "success") return <div role="status" className="border border-blue-200 bg-blue-50 p-6 font-semibold text-blue-900">{message}</div>;

  return (
    <form onSubmit={submit} className="space-y-5 border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-navy">{isFrench ? "S’inscrire comme bénévole" : "Register as a volunteer"}</h2>
        <p className="mt-1 text-sm text-slate-600">{isFrench ? "Choisissez le rôle qui correspond le mieux à vos intérêts." : "Choose the event role that best fits your interests."}</p>
      </div>
      <label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Rôle" : "Volunteer role"}</span><select name="role" required className="w-full border border-slate-300 bg-white px-3 py-3 font-normal">{event.roles.map((role) => <option key={role}>{role}</option>)}</select></label>
      <label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Nom complet" : "Full name"}</span><input name="fullName" required maxLength={160} autoComplete="name" className="w-full border border-slate-300 px-3 py-3 font-normal" /></label>
      <label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Adresse courriel (facultatif)" : "Email address (optional)"}</span><input name="email" type="email" maxLength={320} autoComplete="email" className="w-full border border-slate-300 px-3 py-3 font-normal" /></label>
      {status === "error" && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{message}</p>}
      <button disabled={status === "submitting" || event.soldOut} className="w-full bg-brand-navy px-5 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-60">{event.soldOut ? (isFrench ? "Complet" : "Event is full") : status === "submitting" ? (isFrench ? "Inscription…" : "Registering…") : (isFrench ? "Confirmer mon bénévolat" : "Confirm volunteer registration")}</button>
    </form>
  );
}

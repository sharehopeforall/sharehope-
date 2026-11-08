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
    try {
      const response = await fetch(`/api/events/${encodeURIComponent(event.slug)}/rsvp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName: form.get("fullName"), email: form.get("email"), guestCount: 1, passType: `Volunteer — ${form.get("role")}`, registrationType: "VOLUNTEER", locale }),
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(result.error ?? result.message ?? (isFrench ? "L’inscription n’a pas pu être enregistrée." : "Your volunteer registration could not be saved."));
      setMessage(isFrench ? "Vérifiez votre courriel pour confirmer votre inscription de bénévole." : "Check your email to confirm your volunteer registration.");
      setStatus("success");
      formElement.reset();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : (isFrench ? "L’inscription n’a pas pu être enregistrée." : "Your volunteer registration could not be saved."));
      setStatus("error");
    }
  }

  if (status === "success") return <div role="status" className="border border-blue-200 bg-blue-50 p-6 font-semibold text-blue-900">{message}</div>;

  if (event.registrationClosed || event.soldOut) return <div className="border border-amber-200 bg-amber-50 p-6 text-center font-semibold text-amber-900">{event.registrationClosed ? (isFrench ? "Les inscriptions sont closes." : "Registration is closed.") : (isFrench ? "Cet événement est complet." : "This event is sold out.")}</div>;
  if (!event.roles.length) return <div className="border border-amber-200 bg-amber-50 p-6 text-center font-semibold text-amber-900">{isFrench ? "Aucun rôle de bénévole n’est disponible." : "No volunteer roles are available."}</div>;

  return (
    <form onSubmit={submit} className="space-y-5 border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h2 className="font-serif text-2xl font-bold text-brand-navy">{isFrench ? "S’inscrire comme bénévole" : "Register as a volunteer"}</h2>
        <p className="mt-1 text-sm text-slate-600">{isFrench ? "Choisissez le rôle qui correspond le mieux à vos intérêts." : "Choose the event role that best fits your interests."}</p>
      </div>
      <label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Rôle" : "Volunteer role"}</span><select name="role" required className="w-full border border-slate-300 bg-white px-3 py-3 font-normal">{event.roles.map((role) => <option key={role}>{role}</option>)}</select></label>
      <label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Nom complet" : "Full name"}</span><input name="fullName" required maxLength={160} autoComplete="name" className="w-full border border-slate-300 px-3 py-3 font-normal" /></label>
      <label className="block space-y-1.5 text-sm font-bold text-brand-navy"><span>{isFrench ? "Adresse courriel" : "Email address"}</span><input name="email" required type="email" maxLength={320} autoComplete="email" className="w-full border border-slate-300 px-3 py-3 font-normal" /></label>
      {status === "error" && <p role="alert" className="border border-red-200 bg-red-50 p-3 text-sm font-semibold text-red-800">{message}</p>}
      <button disabled={status === "submitting"} className="w-full bg-brand-navy px-5 py-4 text-sm font-bold uppercase tracking-widest text-white disabled:cursor-not-allowed disabled:opacity-60">{status === "submitting" ? (isFrench ? "Inscription…" : "Registering…") : (isFrench ? "Envoyer le lien de vérification" : "Send verification link")}</button>
    </form>
  );
}

"use client";

import { useState } from "react";
import { Link } from "@/i18n/navigation";

export function EventConfirmation({ token, locale }: { token: string; locale: string }) {
  const french = locale === "fr";
  const [state, setState] = useState<"idle"|"pending"|"success"|"error">("idle");
  const [message, setMessage] = useState("");
  async function confirm() {
    setState("pending");
    const response = await fetch("/api/events/confirm", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify({token}) });
    const body = await response.json().catch(()=>({})) as {error?:string};
    if (!response.ok) { setMessage(body.error || (french ? "Le lien est invalide ou expiré." : "The link is invalid or expired.")); setState("error"); return; }
    setState("success");
  }
  if (state === "success") return <div role="status" className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center"><h1 className="font-serif text-3xl font-bold text-brand-navy">{french?"Inscription confirmée":"Registration confirmed"}</h1><p className="mt-3 text-emerald-900">{french?"Votre place est réservée. Un courriel de confirmation vous a été envoyé.":"Your place is reserved. A confirmation email has been sent."}</p><Link href="/events" className="mt-6 inline-block font-bold text-brand-navy underline">{french?"Voir les événements":"View events"}</Link></div>;
  return <div className="rounded-2xl border bg-white p-8 text-center shadow-sm"><h1 className="font-serif text-3xl font-bold text-brand-navy">{french?"Confirmer votre inscription":"Confirm your registration"}</h1><p className="mt-3 text-slate-600">{french?"Cliquez ci-dessous pour réserver votre place.":"Click below to reserve your place."}</p>{state==="error"&&<p role="alert" className="mt-4 text-sm font-semibold text-red-700">{message}</p>}<button onClick={confirm} disabled={!token||state==="pending"} className="mt-6 rounded-lg bg-brand-navy px-6 py-3 font-bold text-white disabled:opacity-50">{state==="pending"?(french?"Confirmation…":"Confirming…"):(french?"Confirmer":"Confirm registration")}</button></div>;
}

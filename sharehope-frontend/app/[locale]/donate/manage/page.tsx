"use client";

import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

type Donation = { provider: string; status: string; amount: number; currency: string; designation: string };

function ManageDonation() {
  const { locale } = useParams<{ locale: string }>();
  const token = useSearchParams().get("token") || "";
  const french = locale === "fr";
  const [donation, setDonation] = useState<Donation | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetch(`/api/donations/manage?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error); setDonation(data); })
      .catch((reason) => setError(reason instanceof Error ? reason.message : "Unable to load donation."))
      .finally(() => setLoading(false));
  }, [token]);

  async function cancel() {
    if (!window.confirm(french ? "Annuler ce don mensuel ? Aucun autre paiement récurrent ne sera prélevé." : "Cancel this monthly donation? No additional recurring payments will be collected.")) return;
    setCancelling(true); setError("");
    try {
      const response = await fetch("/api/donations/manage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      setDonation(data);
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Unable to cancel donation."); }
    finally { setCancelling(false); }
  }

  const cancelled = donation && /cancel/i.test(donation.status);
  return <main className="flex min-h-[70vh] items-center justify-center bg-[#FAF7F2] px-6 py-16 text-brand-navy">
    <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-xl sm:p-10">
      <p className="text-xs font-bold uppercase tracking-[.18em] text-blue-700">ShareHope</p>
      <h1 className="mt-3 font-serif text-4xl font-bold">{french ? "Gérer votre don mensuel" : "Manage your monthly donation"}</h1>
      {loading && <p className="mt-6 text-slate-600">{french ? "Chargement…" : "Loading…"}</p>}
      {error && <p role="alert" className="mt-6 rounded-lg bg-red-50 p-4 text-sm font-medium text-red-800">{error}</p>}
      {donation && <>
        <dl className="mt-7 grid grid-cols-2 gap-4 rounded-xl bg-slate-50 p-5 text-sm">
          <div><dt className="text-slate-500">{french ? "Montant" : "Amount"}</dt><dd className="mt-1 font-bold">{new Intl.NumberFormat(french ? "fr" : "en-US", { style: "currency", currency: donation.currency }).format(donation.amount)} / {french ? "mois" : "month"}</dd></div>
          <div><dt className="text-slate-500">{french ? "Statut" : "Status"}</dt><dd className="mt-1 font-bold">{donation.status}</dd></div>
          <div><dt className="text-slate-500">{french ? "Programme" : "Supports"}</dt><dd className="mt-1 capitalize">{donation.designation}</dd></div>
          <div><dt className="text-slate-500">{french ? "Paiement" : "Payment"}</dt><dd className="mt-1 capitalize">{donation.provider}</dd></div>
        </dl>
        {cancelled ? <p className="mt-6 rounded-lg bg-green-50 p-4 font-medium text-green-800">{donation.status === "Cancellation scheduled" ? (french ? "Votre annulation est programmée. Aucun renouvellement ne sera prélevé." : "Your cancellation is scheduled. You will not be charged again.") : (french ? "Votre don mensuel a été annulé." : "Your monthly donation has been cancelled.")}</p>
          : <button type="button" onClick={cancel} disabled={cancelling} className="mt-7 w-full rounded-lg border border-red-300 px-5 py-3 font-bold text-red-700 hover:bg-red-50 disabled:opacity-50">{cancelling ? (french ? "Annulation…" : "Cancelling…") : (french ? "Annuler le don mensuel" : "Cancel monthly donation")}</button>}
      </>}
      <Link href={`/${locale}/donate`} className="mt-6 inline-block text-sm font-bold underline">{french ? "Retour aux dons" : "Return to donations"}</Link>
    </section>
  </main>;
}

export default function ManageDonationPage() {
  return <Suspense fallback={<main className="min-h-[70vh] bg-[#FAF7F2]" />}><ManageDonation /></Suspense>;
}

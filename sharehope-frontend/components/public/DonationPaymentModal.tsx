"use client";

import { useCallback, useEffect, useState } from "react";
import { CreditCard, Lock, X } from "lucide-react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import type { DonationProgram } from "@/lib/payments";

const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : null;

export default function DonationPaymentModal({
  open,
  onClose,
  locale,
  amount,
  frequency,
  program = "general",
  event,
}: {
  open: boolean;
  onClose: () => void;
  locale: string;
  amount: number;
  frequency: "monthly" | "once";
  program?: DonationProgram;
  event?: string;
}) {
  const french = locale === "fr";
  const router = useRouter();
  const [loadingProvider, setLoadingProvider] = useState<"stripe" | "paypal" | null>(null);
  const [error, setError] = useState("");
  const [stripeClientSecret, setStripeClientSecret] = useState<string | null>(null);
  const closeModal = useCallback(() => {
    setError("");
    setLoadingProvider(null);
    setStripeClientSecret(null);
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (!open) return;
    const closeOnEscape = (keyboardEvent: KeyboardEvent) => {
      if (keyboardEvent.key === "Escape" && !loadingProvider) closeModal();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [closeModal, loadingProvider, open]);

  if (!open) return null;

  async function startCheckout(provider: "stripe" | "paypal") {
    setError("");
    setLoadingProvider(provider);
    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, amount, frequency, program, event, locale, embedded: provider === "stripe" }),
      });
      const data = await response.json() as { url?: string; clientSecret?: string; error?: string };
      if (!response.ok) throw new Error(data.error || (french ? "Impossible d’ouvrir le paiement." : "Unable to open checkout."));
      if (provider === "stripe") {
        if (!stripePromise) throw new Error(french ? "La clé publique Stripe n’est pas configurée." : "Stripe publishable key is not configured.");
        if (!data.clientSecret) throw new Error(data.error || (french ? "Impossible d’afficher le formulaire de carte." : "Unable to display the card form."));
        setStripeClientSecret(data.clientSecret);
        setLoadingProvider(null);
        return;
      }
      if (!data.url) throw new Error(data.error || (french ? "Impossible d’ouvrir PayPal." : "Unable to open PayPal."));
      window.location.assign(data.url);
    } catch (checkoutError) {
      setError(checkoutError instanceof Error ? checkoutError.message : (french ? "Impossible d’ouvrir le paiement." : "Unable to open checkout."));
      setLoadingProvider(null);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget && !loadingProvider) closeModal(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" className="relative w-full max-w-md rounded-xl bg-white p-6 text-[#121212] shadow-2xl sm:p-8">
        <button type="button" aria-label={french ? "Fermer" : "Close"} disabled={Boolean(loadingProvider)} onClick={closeModal} className="absolute right-4 top-4 rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40"><X size={20} /></button>
        <div className="pr-8">
          <p className="font-mono-spaced text-[10px] font-bold uppercase tracking-widest text-[#64748B]">{french ? "Choisissez un mode de paiement sécurisé" : "Choose a secure payment method"}</p>
          <h2 id="payment-modal-title" className="font-serif mt-2 text-3xl font-bold">{french ? "Faire un don" : "Donate now"} — ${amount}</h2>
          <p className="mt-2 text-sm text-slate-600">{french ? "Comment souhaitez-vous effectuer votre don ?" : "How would you like to complete your donation?"}</p>
        </div>
        {stripeClientSecret ? (
          <div className="mt-6 max-h-[70vh] overflow-y-auto">
            <EmbeddedCheckoutProvider
              stripe={stripePromise}
              options={{
                clientSecret: stripeClientSecret,
                onComplete: () => {
                  const sessionId = stripeClientSecret.split("_secret_")[0];
                  router.push(`/${locale}/donate/success?provider=stripe&session_id=${encodeURIComponent(sessionId)}`);
                },
              }}
            >
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        ) : <div className="mt-7 space-y-3">
          <button type="button" autoFocus disabled={Boolean(loadingProvider)} onClick={() => startCheckout("stripe")} className="font-mono-spaced flex w-full items-center justify-center gap-2 rounded bg-[#121212] py-4 text-xs font-bold uppercase tracking-widest text-white transition hover:bg-slate-800 disabled:cursor-wait disabled:opacity-60"><CreditCard size={16} /> {loadingProvider === "stripe" ? (french ? "Ouverture du paiement sécurisé…" : "Opening secure checkout…") : (french ? "Carte de crédit ou de débit" : "Credit or debit card")}</button>
          <button type="button" disabled={Boolean(loadingProvider)} onClick={() => startCheckout("paypal")} className="font-mono-spaced w-full rounded bg-[#FFC439] py-4 text-xs font-bold uppercase tracking-widest text-[#003087] transition hover:bg-[#F2BA36] disabled:cursor-wait disabled:opacity-60">{loadingProvider === "paypal" ? (french ? "Ouverture du paiement sécurisé…" : "Opening secure checkout…") : "PayPal"}</button>
          {error && <p role="alert" className="text-center text-xs font-medium text-red-700">{error}</p>}
        </div>}
        <p className="font-mono-spaced mt-5 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400"><Lock size={11} /> {french ? "Don sécurisé • Déductible d'impôt" : "Secure donation • Tax-deductible"}</p>
      </section>
    </div>
  );
}

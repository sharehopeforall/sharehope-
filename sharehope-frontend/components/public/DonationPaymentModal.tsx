"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { CreditCard, Lock, X } from "lucide-react";
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useRouter } from "next/navigation";
import PhoneInput from "react-phone-number-input/input";
import { getCountries, getCountryCallingCode, isValidPhoneNumber, type Country } from "react-phone-number-input";
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
  const [donor, setDonor] = useState<{ firstName: string; lastName: string; email: string; country: Country; phone: string }>({ firstName: "", lastName: "", email: "", country: "US", phone: "" });
  const countryNames = new Intl.DisplayNames([french ? "fr" : "en"], { type: "region" });
  const countries = getCountries().map((country) => ({ country, name: countryNames.of(country) ?? country })).sort((a, b) => a.name.localeCompare(b.name, french ? "fr" : "en"));
  const closeModal = useCallback(() => {
    setError("");
    setLoadingProvider(null);
    setStripeClientSecret(null);
    setDonor({ firstName: "", lastName: "", email: "", country: "US", phone: "" });
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

  async function startCheckout(provider: "stripe" | "paypal", includeDonor = false) {
    setError("");
    setLoadingProvider(provider);
    try {
      const response = await fetch("/api/donations/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          provider, amount, frequency, program, event, locale, embedded: provider === "stripe",
          donor: includeDonor ? {
            firstName: donor.firstName,
            lastName: donor.lastName,
            email: donor.email,
            phone: donor.phone || undefined,
          } : undefined,
        }),
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

  function continueWithCard(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (donor.phone && !isValidPhoneNumber(donor.phone)) {
      setError(french ? "Entrez un numéro de téléphone valide ou laissez ce champ vide." : "Enter a valid phone number or leave this field blank.");
      return;
    }
    void startCheckout("stripe", true);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-5 backdrop-blur-sm" role="presentation" onMouseDown={(mouseEvent) => { if (mouseEvent.target === mouseEvent.currentTarget && !loadingProvider) closeModal(); }}>
      <section role="dialog" aria-modal="true" aria-labelledby="payment-modal-title" className="relative max-h-[92vh] w-full max-w-xl overflow-y-auto bg-white p-6 text-[#121212] shadow-2xl sm:p-8">
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
        ) : <div className="mt-7">
          <p className="text-center text-xs font-bold uppercase tracking-[.16em] text-slate-500">{french ? "Don express" : "Express checkout"}</p>
          <button type="button" autoFocus disabled={Boolean(loadingProvider)} onClick={() => startCheckout("paypal")} className="mt-3 w-full bg-[#FFC439] py-4 text-sm font-bold text-[#003087] transition hover:bg-[#F2BA36] disabled:cursor-wait disabled:opacity-60">{loadingProvider === "paypal" ? (french ? "Ouverture du paiement sécurisé…" : "Opening secure checkout…") : "PayPal"}</button>

          <div className="my-7 flex items-center gap-4"><span className="h-px flex-1 bg-slate-200" /><span className="text-center text-xs font-medium text-slate-500">{french ? "ou saisissez vos coordonnées ci-dessous" : "or enter your details manually below"}</span><span className="h-px flex-1 bg-slate-200" /></div>

          <form onSubmit={continueWithCard} className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-bold text-brand-navy">{french ? "Prénom" : "First name"}<input required autoComplete="given-name" value={donor.firstName} onChange={(event) => setDonor((current) => ({ ...current, firstName: event.target.value }))} className="mt-2 w-full border border-slate-300 px-3 py-3 font-normal outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy" /></label>
              <label className="block text-sm font-bold text-brand-navy">{french ? "Nom" : "Last name"}<input required autoComplete="family-name" value={donor.lastName} onChange={(event) => setDonor((current) => ({ ...current, lastName: event.target.value }))} className="mt-2 w-full border border-slate-300 px-3 py-3 font-normal outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy" /></label>
            </div>
            <label className="block text-sm font-bold text-brand-navy">{french ? "Courriel" : "Email"}<input required type="email" autoComplete="email" value={donor.email} onChange={(event) => setDonor((current) => ({ ...current, email: event.target.value }))} className="mt-2 w-full border border-slate-300 px-3 py-3 font-normal outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy" /></label>
            <div>
              <label className="block text-sm font-bold text-brand-navy" htmlFor="donor-country">{french ? "Pays" : "Country"}</label>
              <select id="donor-country" value={donor.country} onChange={(event) => setDonor((current) => ({ ...current, country: event.target.value as Country, phone: "" }))} className="mt-2 w-full border border-slate-300 bg-white px-3 py-3 text-sm font-normal text-brand-navy outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy">{countries.map(({ country, name }) => <option key={country} value={country}>{name} +{getCountryCallingCode(country)}</option>)}</select>
            </div>
            <label className="block text-sm font-bold text-brand-navy">{french ? "Numéro de téléphone (facultatif)" : "Phone number (optional)"}<PhoneInput country={donor.country} value={donor.phone || undefined} onChange={(phone) => setDonor((current) => ({ ...current, phone: phone ?? "" }))} autoComplete="tel" className="mt-2 w-full border border-slate-300 px-3 py-3 font-normal outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy" /></label>
            <button type="submit" disabled={Boolean(loadingProvider)} className="flex w-full items-center justify-center gap-2 bg-brand-navy py-4 text-sm font-bold uppercase tracking-[.12em] text-white transition hover:bg-[#13306B] disabled:cursor-wait disabled:opacity-60"><CreditCard size={16} />{loadingProvider === "stripe" ? (french ? "Ouverture du paiement sécurisé…" : "Opening secure checkout…") : (french ? "Continuer vers le paiement" : "Continue to payment")}</button>
          </form>
          {error && <p role="alert" className="mt-4 text-center text-xs font-medium text-red-700">{error}</p>}
        </div>}
        <p className="font-mono-spaced mt-5 flex items-center justify-center gap-1.5 text-center text-[10px] text-slate-400"><Lock size={11} /> {french ? "Paiement sécurisé et chiffré" : "Secure, encrypted checkout"}</p>
      </section>
    </div>
  );
}

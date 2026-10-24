import { CheckCircle2, Heart } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { paypalRequest } from "@/lib/payments";

async function isConfirmed(query: { provider?: string; reference?: string; session_id?: string; frequency?: string; subscription_id?: string; token?: string }) {
  try {
    if (query.provider === "stripe" && query.session_id && process.env.STRIPE_SECRET_KEY) {
      const response = await fetch(`https://api.stripe.com/v1/checkout/sessions/${encodeURIComponent(query.session_id)}`, {
        headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` },
        cache: "no-store",
      });
      const session = await response.json();
      return response.ok && session.status === "complete" && (session.payment_status === "paid" || session.payment_status === "no_payment_required");
    }
    if (query.provider === "paypal" && query.frequency === "monthly") {
      const id = query.subscription_id || query.token;
      if (!id) return false;
      const subscription = await paypalRequest(`/v1/billing/subscriptions/${encodeURIComponent(id)}`);
      return subscription.status === "ACTIVE" || subscription.status === "APPROVAL_PENDING";
    }
    if (query.provider === "paypal" && query.reference) {
      const order = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(query.reference)}`);
      return order.status === "COMPLETED";
    }
  } catch {
    return false;
  }
  return false;
}

export default async function DonationSuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ provider?: string; reference?: string; session_id?: string; frequency?: string; subscription_id?: string; token?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const french = locale === "fr";
  const reference = query.reference || query.session_id || query.subscription_id || query.token;
  const confirmed = await isConfirmed(query);

  if (!confirmed) {
    return (
      <main className="flex min-h-[70vh] items-center bg-[#FAF7F2] px-6 py-20 text-[#121212]">
        <section className="mx-auto w-full max-w-2xl rounded-xl border border-[#E5E0D8] bg-white p-8 text-center shadow-xl sm:p-12">
          <h1 className="font-serif text-4xl font-bold">{french ? "Confirmation en attente" : "Confirmation pending"}</h1>
          <p className="mx-auto mt-5 max-w-lg leading-relaxed text-slate-600">
            {french ? "Nous n’avons pas pu vérifier ce paiement. Consultez d’abord votre courriel ou votre compte de paiement avant de réessayer." : "We couldn't verify this payment. Check your email or payment account before trying again."}
          </p>
          <Link href="/donate" className="font-mono-spaced mt-8 inline-flex rounded bg-[#FFC72C] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[#121212]">
            {french ? "Retour aux dons" : "Return to donations"}
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="flex min-h-[70vh] items-center bg-[#FAF7F2] px-6 py-20 text-[#121212]">
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-[#E5E0D8] bg-white p-8 text-center shadow-xl sm:p-12">
        <div className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
          <CheckCircle2 size={36} />
        </div>
        <p className="font-mono-spaced mt-6 text-xs font-bold uppercase tracking-widest text-emerald-700">
          {french ? "Don confirmé" : "Donation confirmed"}
        </p>
        <h1 className="font-serif mt-3 text-4xl font-bold sm:text-5xl">
          {french ? "Merci pour votre générosité." : "Thank you for your generosity."}
        </h1>
        <p className="mx-auto mt-5 max-w-lg leading-relaxed text-slate-600">
          {french
            ? "Votre paiement a été confirmé. Un reçu sera envoyé par le prestataire de paiement à l’adresse courriel utilisée lors du paiement."
            : "Your payment has been confirmed. The payment provider will send a receipt to the email address used at checkout."}
        </p>
        {query.frequency === "monthly" && (
          <p className="mt-3 text-sm font-semibold text-slate-600">
            {french ? "Votre soutien mensuel est maintenant actif." : "Your monthly support is now active."}
          </p>
        )}
        {reference && <p className="mt-5 font-mono text-xs text-slate-400">{french ? "Référence" : "Reference"}: {reference}</p>}
        <Link href="/" className="font-mono-spaced mt-8 inline-flex items-center gap-2 rounded bg-[#FFC72C] px-7 py-4 text-xs font-bold uppercase tracking-widest text-[#121212] hover:bg-[#E2AD17]">
          <Heart size={15} /> {french ? "Retour à l’accueil" : "Return home"}
        </Link>
      </section>
    </main>
  );
}

import { NextResponse } from "next/server";
import { absoluteAppUrl, paypalRequest } from "@/lib/payments";
import { fetchBackend } from "@/lib/server/backend-fetch";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const subscriptionId = url.searchParams.get("subscription_id");
  const locale = url.searchParams.get("locale") === "fr" ? "fr" : "en";
  if (!subscriptionId || !/^[A-Z0-9-]+$/i.test(subscriptionId)) {
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate?payment_error=1`));
  }
  try {
    const subscription = await paypalRequest(`/v1/billing/subscriptions/${encodeURIComponent(subscriptionId)}`);
    if (subscription.status !== "ACTIVE" && subscription.status !== "APPROVAL_PENDING") throw new Error("Subscription is not active.");
    const subscriber = subscription.subscriber as { email_address?: string; name?: { given_name?: string; surname?: string } } | undefined;
    const lastPayment = (subscription.billing_info as { last_payment?: { amount?: { value?: string; currency_code?: string } } } | undefined)?.last_payment;
    let amount = lastPayment?.amount;
    if (!amount?.value && typeof subscription.plan_id === "string") {
      const plan = await paypalRequest(`/v1/billing/plans/${encodeURIComponent(subscription.plan_id)}`);
      const cycles = Array.isArray(plan.billing_cycles) ? plan.billing_cycles as Array<{ tenure_type?: string; pricing_scheme?: { fixed_price?: { value?: string; currency_code?: string } } }> : [];
      amount = cycles.find((cycle) => cycle.tenure_type === "REGULAR")?.pricing_scheme?.fixed_price;
    }
    const name = subscriber?.name ? `${subscriber.name.given_name ?? ""} ${subscriber.name.surname ?? ""}`.trim() : undefined;
    const backendUrl = process.env.BACKEND_URL;
    const secret = process.env.PAYMENT_INTERNAL_SECRET;
    if (!backendUrl || !secret) throw new Error("Donation recording is not configured.");
    const response = await fetchBackend(`${backendUrl.replace(/\/$/, "")}/api/public/payment-events`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Payment-Secret": secret },
      body: JSON.stringify({
        provider: "paypal", providerReference: subscriptionId, subscriptionReference: subscriptionId,
        donorName: name, donorEmail: subscriber?.email_address,
        amountCents: Math.max(1, Math.round(Number(amount?.value || 0) * 100)),
        currency: amount?.currency_code || "USD", frequency: "Monthly",
        designation: subscription.custom_id || "general", status: "Succeeded",
      }),
    }, 8_000);
    if (!response.ok) throw new Error("Donation recording failed.");
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate/success?provider=paypal&frequency=monthly&reference=${encodeURIComponent(subscriptionId)}`));
  } catch {
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate?payment_error=1`));
  }
}

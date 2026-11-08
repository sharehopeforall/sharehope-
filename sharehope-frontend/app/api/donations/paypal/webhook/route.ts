import { NextResponse } from "next/server";
import { paypalRequest } from "@/lib/payments";
import { fetchBackend } from "@/lib/server/backend-fetch";

export const runtime = "nodejs";

async function backend(path: string, init: RequestInit) {
  const url = process.env.BACKEND_URL;
  const secret = process.env.PAYMENT_INTERNAL_SECRET;
  if (!url || !secret) throw new Error("Donation recording is not configured.");
  return fetchBackend(`${url.replace(/\/$/, "")}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "X-Payment-Secret": secret, ...init.headers },
  }, 8_000);
}

export async function POST(request: Request) {
  const event = await request.json();
  const webhookId = process.env.PAYPAL_WEBHOOK_ID;
  if (!webhookId) return NextResponse.json({ error: "PayPal webhook is not configured." }, { status: 503 });
  const verification = await paypalRequest("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: request.headers.get("paypal-auth-algo"), cert_url: request.headers.get("paypal-cert-url"),
      transmission_id: request.headers.get("paypal-transmission-id"), transmission_sig: request.headers.get("paypal-transmission-sig"),
      transmission_time: request.headers.get("paypal-transmission-time"), webhook_id: webhookId, webhook_event: event,
    }),
  });
  if (verification.verification_status !== "SUCCESS") return NextResponse.json({ error: "Invalid signature." }, { status: 400 });

  const resource = event.resource ?? {};
  const type = String(event.event_type || "");
  const subscriptionReference = resource.billing_agreement_id || resource.subscription_id
    || (type.startsWith("BILLING.SUBSCRIPTION.") ? resource.id : undefined);

  if (type.includes("CANCELLED") && subscriptionReference) {
    const response = await backend(`/api/public/payment-events/${encodeURIComponent(String(subscriptionReference))}`, {
      method: "PATCH", body: JSON.stringify({ status: "Cancelled" }),
    });
    if (!response.ok && response.status !== 404) return NextResponse.json({ error: "Donation update failed." }, { status: 502 });
    return NextResponse.json({ received: true });
  }
  if (type.includes("SUSPENDED") && subscriptionReference) {
    await backend(`/api/public/payment-events/${encodeURIComponent(String(subscriptionReference))}`, {
      method: "PATCH", body: JSON.stringify({ status: "Suspended" }),
    });
    return NextResponse.json({ received: true });
  }
  if (type === "BILLING.SUBSCRIPTION.ACTIVATED") return NextResponse.json({ received: true });

  const completed = type.includes("COMPLETED");
  const failed = type.includes("FAILED") || type.includes("DENIED");
  if (!completed && !failed) return NextResponse.json({ received: true });
  const amount = resource.amount ?? resource.billing_info?.last_payment?.amount ?? {};
  const reference = resource.id;
  if (reference) {
    const response = await backend("/api/public/payment-events", {
      method: "POST",
      body: JSON.stringify({
        provider: "paypal", providerReference: String(reference),
        subscriptionReference: subscriptionReference ? String(subscriptionReference) : undefined,
        donorEmail: resource.subscriber?.email_address || resource.payer?.email_address,
        donorName: resource.subscriber?.name
          ? `${resource.subscriber.name.given_name || ""} ${resource.subscriber.name.surname || ""}`.trim()
          : undefined,
        amountCents: Math.max(1, Math.round(Number(amount.value || 0) * 100)),
        currency: amount.currency_code || "USD", frequency: subscriptionReference ? "Monthly" : "One-time",
        designation: resource.custom_id || "general", status: completed ? "Succeeded" : "Failed",
      }),
    });
    if (!response.ok) return NextResponse.json({ error: "Donation recording failed." }, { status: 502 });
  }
  return NextResponse.json({ received: true });
}

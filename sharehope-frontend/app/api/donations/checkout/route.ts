import { NextResponse } from "next/server";
import { absoluteAppUrl, parseDonationCheckout, paypalRequest } from "@/lib/payments";
import { rateLimited } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

function approvalUrl(data: Record<string, unknown>) {
  const links = Array.isArray(data.links) ? data.links : [];
  const approval = links.find((link) => {
    if (!link || typeof link !== "object") return false;
    const rel = (link as { rel?: string }).rel;
    return rel === "approve" || rel === "payer-action";
  }) as { href?: string } | undefined;
  if (!approval?.href) throw new Error("Payment approval URL was not returned.");
  return approval.href;
}

async function stripeCheckout(request: Request, donation: ReturnType<typeof parseDonationCheckout>, embedded: boolean) {
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) throw new Error("Stripe is not configured.");

  const successUrl = absoluteAppUrl(request, `/${donation.locale}/donate/success?provider=stripe&session_id={CHECKOUT_SESSION_ID}`);
  const cancelUrl = absoluteAppUrl(request, `/${donation.locale}/donate?cancelled=1`);
  const description = donation.event ? `Event: ${donation.event}` : `Program: ${donation.program}`;
  const params = new URLSearchParams({
    mode: donation.frequency === "monthly" ? "subscription" : "payment",
    "line_items[0][quantity]": "1",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][unit_amount]": String(Math.round(donation.amount * 100)),
    "line_items[0][price_data][product_data][name]": "ShareHope donation",
    "line_items[0][price_data][product_data][description]": description,
    "metadata[program]": donation.program,
    "metadata[frequency]": donation.frequency,
    "payment_intent_data[metadata][program]": donation.program,
  });
  if (donation.donor) {
    const donorName = `${donation.donor.firstName} ${donation.donor.lastName}`;
    params.set("customer_email", donation.donor.email);
    params.set("metadata[donor_name]", donorName);
    params.set("metadata[donor_email]", donation.donor.email);
    if (donation.donor.phone) params.set("metadata[donor_phone]", donation.donor.phone);
    params.set("payment_intent_data[metadata][donor_name]", donorName);
    params.set("payment_intent_data[metadata][donor_email]", donation.donor.email);
    if (donation.donor.phone) params.set("payment_intent_data[metadata][donor_phone]", donation.donor.phone);
  }
  if (embedded) {
    params.set("ui_mode", "embedded");
    params.set("return_url", successUrl);
  } else {
    params.set("success_url", successUrl);
    params.set("cancel_url", cancelUrl);
  }
  if (donation.event) {
    params.set("metadata[event]", donation.event);
    params.set("payment_intent_data[metadata][event]", donation.event);
  }
  if (donation.frequency === "monthly") {
    params.set("line_items[0][price_data][recurring][interval]", "month");
    params.delete("payment_intent_data[metadata][program]");
    params.delete("payment_intent_data[metadata][event]");
    params.delete("payment_intent_data[metadata][donor_name]");
    params.delete("payment_intent_data[metadata][donor_email]");
    params.delete("payment_intent_data[metadata][donor_phone]");
    params.set("subscription_data[metadata][program]", donation.program);
    if (donation.donor) {
      params.set("subscription_data[metadata][donor_name]", `${donation.donor.firstName} ${donation.donor.lastName}`);
      params.set("subscription_data[metadata][donor_email]", donation.donor.email);
      if (donation.donor.phone) params.set("subscription_data[metadata][donor_phone]", donation.donor.phone);
    }
    if (donation.event) params.set("subscription_data[metadata][event]", donation.event);
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: params,
    cache: "no-store",
  });
  const data = await response.json();
  const checkoutValue = embedded ? data.client_secret : data.url;
  if (!response.ok || typeof checkoutValue !== "string") {
    console.error("Stripe checkout error", response.status, data);
    throw new Error("Stripe could not start checkout.");
  }
  return embedded ? { clientSecret: checkoutValue as string } : { url: checkoutValue as string };
}

async function paypalCheckout(request: Request, donation: ReturnType<typeof parseDonationCheckout>) {
  const cancelUrl = absoluteAppUrl(request, `/${donation.locale}/donate?cancelled=1`);
  const description = donation.event ? `ShareHope event donation: ${donation.event}` : `ShareHope donation: ${donation.program}`;

  if (donation.frequency === "once") {
    const returnUrl = absoluteAppUrl(request, `/api/donations/paypal/complete?locale=${donation.locale}`);
    const order = await paypalRequest("/v2/checkout/orders", {
      method: "POST",
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          description,
          custom_id: [donation.program, donation.event].filter(Boolean).join(":"),
          amount: { currency_code: "USD", value: donation.amount.toFixed(2) },
        }],
        payment_source: { paypal: { experience_context: { return_url: returnUrl, cancel_url: cancelUrl, user_action: "PAY_NOW", shipping_preference: "NO_SHIPPING" } } },
      }),
    });
    return approvalUrl(order);
  }

  const product = await paypalRequest("/v1/catalogs/products", {
    method: "POST",
    body: JSON.stringify({ name: "ShareHope monthly donation", description, type: "SERVICE", category: "CHARITY" }),
  });
  if (typeof product.id !== "string") throw new Error("PayPal product creation failed.");
  const plan = await paypalRequest("/v1/billing/plans", {
    method: "POST",
    body: JSON.stringify({
      product_id: product.id,
      name: `$${donation.amount.toFixed(2)} monthly ShareHope donation`,
      description,
      status: "ACTIVE",
      billing_cycles: [{ frequency: { interval_unit: "MONTH", interval_count: 1 }, tenure_type: "REGULAR", sequence: 1, total_cycles: 0, pricing_scheme: { fixed_price: { value: donation.amount.toFixed(2), currency_code: "USD" } } }],
      payment_preferences: { auto_bill_outstanding: true, payment_failure_threshold: 3 },
    }),
  });
  if (typeof plan.id !== "string") throw new Error("PayPal plan creation failed.");
  const successUrl = absoluteAppUrl(request, `/${donation.locale}/donate/success?provider=paypal&frequency=monthly`);
  const subscription = await paypalRequest("/v1/billing/subscriptions", {
    method: "POST",
    body: JSON.stringify({
      plan_id: plan.id,
      custom_id: [donation.program, donation.event].filter(Boolean).join(":"),
      application_context: { brand_name: "ShareHope", user_action: "SUBSCRIBE_NOW", shipping_preference: "NO_SHIPPING", return_url: successUrl, cancel_url: cancelUrl },
    }),
  });
  return approvalUrl(subscription);
}

export async function POST(request: Request) {
  if (rateLimited(request, "checkout", 10)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  try {
    const body = await request.json() as Record<string, unknown>;
    const donation = parseDonationCheckout(body);
    if (donation.provider === "stripe") {
      return NextResponse.json(await stripeCheckout(request, donation, body.embedded === true));
    }
    return NextResponse.json({ url: await paypalCheckout(request, donation) });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to start checkout.";
    const status = /Invalid|Select|amount/.test(message) ? 400 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}

import { NextResponse } from "next/server";
import { absoluteAppUrl, paypalRequest } from "@/lib/payments";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const orderId = url.searchParams.get("token");
  const locale = url.searchParams.get("locale") === "fr" ? "fr" : "en";
  if (!orderId || !/^[A-Z0-9-]+$/i.test(orderId)) {
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate?payment_error=1`));
  }

  try {
    const capture = await paypalRequest(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, { method: "POST" });
    if (capture.status !== "COMPLETED") throw new Error("PayPal payment was not completed.");
    const unit = Array.isArray(capture.purchase_units) ? capture.purchase_units[0] as Record<string, unknown> : {};
    const payments = unit?.payments as { captures?: Array<Record<string, unknown>> } | undefined;
    const paid = payments?.captures?.[0]; const amount = paid?.amount as { value?: string; currency_code?: string } | undefined;
    await fetch(`${process.env.BACKEND_URL}/api/public/payment-events`, { method: "POST", headers: { "Content-Type": "application/json", "X-Payment-Secret": process.env.PAYMENT_INTERNAL_SECRET ?? "" }, body: JSON.stringify({ provider: "paypal", providerReference: orderId, donorName: undefined, donorEmail: undefined, amountCents: Math.round(Number(amount?.value) * 100), currency: amount?.currency_code ?? "USD", frequency: "One-time", designation: unit.custom_id ?? "general", status: "Succeeded" }) });
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate/success?provider=paypal&reference=${encodeURIComponent(orderId)}`));
  } catch {
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate?payment_error=1`));
  }
}

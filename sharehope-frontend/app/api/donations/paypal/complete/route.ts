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
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate/success?provider=paypal&reference=${encodeURIComponent(orderId)}`));
  } catch {
    return NextResponse.redirect(absoluteAppUrl(request, `/${locale}/donate?payment_error=1`));
  }
}

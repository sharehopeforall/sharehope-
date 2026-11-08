import { NextResponse } from "next/server";
import { paypalRequest } from "@/lib/payments";
import { fetchBackend } from "@/lib/server/backend-fetch";
import { rateLimited } from "@/lib/server/rate-limit";

export const runtime = "nodejs";

type ManagedDonation = {
  provider: string; providerReference: string; subscriptionReference: string;
  status: string; amountCents: number; currency: string; designation: string;
};

async function donationFor(token: string) {
  const backendUrl = process.env.BACKEND_URL;
  if (!backendUrl) throw new Error("Donation management is not configured.");
  const response = await fetchBackend(`${backendUrl.replace(/\/$/, "")}/api/public/donations/manage/${encodeURIComponent(token)}`, { cache: "no-store" }, 8_000);
  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Unable to load this monthly donation.");
  return response.json() as Promise<ManagedDonation>;
}

function publicDonation(donation: ManagedDonation) {
  return { provider: donation.provider, status: donation.status, amount: donation.amountCents / 100,
    currency: donation.currency, designation: donation.designation };
}

export async function GET(request: Request) {
  if (await rateLimited(request, "manage-donation", 30)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  const token = new URL(request.url).searchParams.get("token") || "";
  if (token.length < 40 || token.length > 200) return NextResponse.json({ error: "This management link is invalid." }, { status: 404 });
  try {
    const donation = await donationFor(token);
    return donation ? NextResponse.json(publicDonation(donation)) : NextResponse.json({ error: "This management link is invalid or expired." }, { status: 404 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load donation." }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (await rateLimited(request, "cancel-donation", 5)) return NextResponse.json({ error: "Too many requests." }, { status: 429 });
  try {
    const { token } = await request.json() as { token?: string };
    if (!token || token.length < 40 || token.length > 200) return NextResponse.json({ error: "This management link is invalid." }, { status: 404 });
    const donation = await donationFor(token);
    if (!donation) return NextResponse.json({ error: "This management link is invalid or expired." }, { status: 404 });
    if (/cancel/i.test(donation.status)) return NextResponse.json({ ...publicDonation(donation), status: donation.status });

    let status: "Cancelled" | "Cancellation scheduled";
    if (donation.provider.toLowerCase() === "stripe") {
      const secret = process.env.STRIPE_SECRET_KEY;
      if (!secret) throw new Error("Stripe cancellation is not configured.");
      const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(donation.subscriptionReference)}`, {
        method: "POST", headers: { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" },
        body: "cancel_at_period_end=true", cache: "no-store",
      });
      if (!response.ok) throw new Error("Stripe could not schedule this cancellation.");
      status = "Cancellation scheduled";
    } else if (donation.provider.toLowerCase() === "paypal") {
      await paypalRequest(`/v1/billing/subscriptions/${encodeURIComponent(donation.subscriptionReference)}/cancel`, {
        method: "POST", body: JSON.stringify({ reason: "Cancelled by donor through ShareHope" }),
      });
      status = "Cancelled";
    } else {
      throw new Error("This payment provider does not support self-service cancellation.");
    }

    const backendUrl = process.env.BACKEND_URL;
    const internalSecret = process.env.PAYMENT_INTERNAL_SECRET;
    if (!backendUrl || !internalSecret) throw new Error("Donation status updates are not configured.");
    const update = await fetchBackend(`${backendUrl.replace(/\/$/, "")}/api/public/payment-events/${encodeURIComponent(donation.subscriptionReference)}`, {
      method: "PATCH", headers: { "Content-Type": "application/json", "X-Payment-Secret": internalSecret }, body: JSON.stringify({ status }),
    }, 8_000);
    if (!update.ok) throw new Error("The provider cancelled the donation, but ShareHope could not update its record.");
    return NextResponse.json({ ...publicDonation(donation), status });
  } catch (error) {
    console.error("Monthly donation cancellation failed", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to cancel this monthly donation." }, { status: 503 });
  }
}

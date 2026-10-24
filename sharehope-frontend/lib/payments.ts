export type DonationFrequency = "once" | "monthly";
export type DonationProgram = "general" | "education" | "health" | "community" | "families" | "widows";
export type PaymentProvider = "stripe" | "paypal";

export type DonationCheckout = {
  provider: PaymentProvider;
  amount: number;
  frequency: DonationFrequency;
  program: DonationProgram;
  event?: string;
  locale: "en" | "fr";
};

const programs = new Set<DonationProgram>(["general", "education", "health", "community", "families", "widows"]);

export function parseDonationCheckout(value: unknown): DonationCheckout {
  if (!value || typeof value !== "object") throw new Error("Invalid checkout request.");
  const input = value as Record<string, unknown>;
  const amount = typeof input.amount === "number" ? input.amount : Number(input.amount);
  const provider = input.provider;
  const frequency = input.frequency;
  const program = input.program;

  if (provider !== "stripe" && provider !== "paypal") throw new Error("Select a payment provider.");
  if (frequency !== "once" && frequency !== "monthly") throw new Error("Invalid donation frequency.");
  if (typeof program !== "string" || !programs.has(program as DonationProgram)) throw new Error("Invalid program.");
  if (!Number.isFinite(amount) || amount < 5 || amount > 100_000 || Math.round(amount * 100) !== amount * 100) {
    throw new Error("Donation amount must be between $5 and $100,000 USD.");
  }

  return {
    provider,
    amount,
    frequency,
    program: program as DonationProgram,
    event: typeof input.event === "string" && input.event.trim() ? input.event.trim().slice(0, 100) : undefined,
    locale: input.locale === "fr" ? "fr" : "en",
  };
}

export function absoluteAppUrl(request: Request, path: string) {
  const configured = process.env.APP_URL?.replace(/\/$/, "");
  return new URL(path, configured || new URL(request.url).origin).toString();
}

export function paypalApiUrl() {
  return process.env.PAYPAL_ENVIRONMENT === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

export async function paypalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
  if (!clientId || !clientSecret) throw new Error("PayPal is not configured.");

  const response = await fetch(`${paypalApiUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok || typeof data.access_token !== "string") throw new Error("Could not connect to PayPal.");
  return data.access_token as string;
}

export async function paypalRequest(path: string, init: RequestInit = {}) {
  const token = await paypalAccessToken();
  const response = await fetch(`${paypalApiUrl()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "PayPal-Request-Id": crypto.randomUUID(),
      ...init.headers,
    },
    cache: "no-store",
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error("PayPal checkout error", response.status, data);
    throw new Error("PayPal could not start checkout.");
  }
  return data as Record<string, unknown>;
}

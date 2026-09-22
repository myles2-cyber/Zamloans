import crypto from "node:crypto";

const SWIFT_WALLET_URL = "https://swiftwallet.co.ke/v3/stk-initiate/";
const DISPLAY_FEE_USD = 10;

function toKes(amountUsd: number) {
  const rate = Number(process.env.USD_KES_RATE || "130");
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("USD_KES_RATE is invalid");
  return Math.ceil(amountUsd * rate);
}

function normalizeKenyanPhone(value: unknown) {
  if (typeof value !== "string" || !/^(?:\+?254|0)7\d{8}$/.test(value)) return null;
  return value.replace(/^\+/, "").replace(/^0/, "254");
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return Response.json({ error: "Only POST is supported" }, { status: 405 });
  }

  const apiKey = process.env.SWIFTWALLET_API_KEY;
  if (!apiKey) return Response.json({ error: "Swift Wallet is not configured" }, { status: 503 });

  let body: { phoneNumber?: unknown };
  try {
    body = await request.json() as { phoneNumber?: unknown };
  } catch {
    return Response.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const phoneNumber = normalizeKenyanPhone(body.phoneNumber);
  if (!phoneNumber) return Response.json({ error: "Enter a valid Kenyan mobile number" }, { status: 400 });

  const externalReference = `CLEARPATH-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  try {
    const response = await fetch(SWIFT_WALLET_URL, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: toKes(DISPLAY_FEE_USD),
        phone_number: phoneNumber,
        external_reference: externalReference,
        customer_name: "ClearPath customer",
      }),
    });
    const payload = await response.json() as { success?: boolean; status?: string; message?: string; reference?: string; transaction_id?: number | string };
    if (!response.ok || !payload.success) {
      return Response.json({ error: payload.message || "Swift Wallet could not start the payment" }, { status: 502 });
    }
    return Response.json({
      success: true,
      amountUsd: DISPLAY_FEE_USD,
      status: payload.status || "INITIATED",
      message: payload.message || "Payment prompt sent to your phone",
      reference: payload.reference || externalReference,
    });
  } catch (error) {
    console.error("Swift Wallet request failed", error);
    return Response.json({ error: "Swift Wallet is temporarily unavailable" }, { status: 502 });
  }
}

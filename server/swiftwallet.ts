import crypto from "node:crypto";
import { updateSwiftWalletPaymentByReference } from "./db";

const SWIFT_WALLET_BASE_URL = "https://swiftwallet.co.ke/v3";

export function usdToKes(amountUsd: number): number {
  const rate = Number(process.env.USD_KES_RATE);
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("USD_KES_RATE is not configured");
  if (!Number.isFinite(amountUsd) || amountUsd <= 0) throw new Error("Fee amount must be greater than zero");
  return Math.ceil(amountUsd * rate);
}

export function verifySwiftWalletSignature(rawBody: Buffer, signature: string | undefined, secret = process.env.SWIFTWALLET_CALLBACK_SECRET): boolean {
  if (!signature || !secret) return false;
  const normalizedSignature = signature.replace(/^sha256=/i, "").trim().toLowerCase();
  const expected = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
  const expectedBuffer = Buffer.from(expected, "utf8");
  const receivedBuffer = Buffer.from(normalizedSignature, "utf8");
  return expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export async function initiateSwiftWalletStkPayment(input: {
  amountUsd: number;
  phoneNumber: string;
  externalReference: string;
  callbackUrl: string;
  customerName?: string;
}) {
  const apiKey = process.env.SWIFTWALLET_API_KEY;
  if (!apiKey) throw new Error("SWIFTWALLET_API_KEY is not configured");
  const amountKes = usdToKes(input.amountUsd);
  const response = await fetch(`${SWIFT_WALLET_BASE_URL}/stk-initiate/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      amount: amountKes,
      phone_number: input.phoneNumber,
      external_reference: input.externalReference,
      customer_name: input.customerName,
      callback_url: input.callbackUrl,
    }),
  });
  const payload = await response.json() as { success?: boolean; status?: string; message?: string; transaction_id?: number | string };
  if (!response.ok || !payload.success) {
    throw new Error(payload.message || `Swift Wallet request failed with HTTP ${response.status}`);
  }
  return { amountKes, payload };
}

export async function handleSwiftWalletCallback(rawBody: Buffer, signature: string | undefined) {
  if (!verifySwiftWalletSignature(rawBody, signature)) return { ok: false, status: 401 } as const;
  const payload = JSON.parse(rawBody.toString("utf8")) as {
    external_reference?: string;
    transaction_id?: number | string;
    status?: string;
  };
  if (!payload.external_reference) return { ok: false, status: 400 } as const;
  const normalizedStatus = payload.status?.toLowerCase();
  const status = normalizedStatus === "completed" ? "completed" : normalizedStatus === "failed" ? "failed" : normalizedStatus === "cancelled" ? "cancelled" : "initiated";
  await updateSwiftWalletPaymentByReference(payload.external_reference, {
    swiftTransactionId: payload.transaction_id ? String(payload.transaction_id) : undefined,
    rawStatus: payload.status,
    status,
  });
  return { ok: true, status: 200 } as const;
}

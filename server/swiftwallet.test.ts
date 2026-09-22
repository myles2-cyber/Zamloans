import crypto from "node:crypto";
import { describe, expect, it } from "vitest";
import { usdToKes, verifySwiftWalletSignature } from "./swiftwallet";

describe("Swift Wallet payment helpers", () => {
  it("converts a USD fee to an internal whole-KES amount", () => {
    const previousRate = process.env.USD_KES_RATE;
    process.env.USD_KES_RATE = "130";
    expect(usdToKes(12.5)).toBe(1625);
    if (previousRate === undefined) delete process.env.USD_KES_RATE;
    else process.env.USD_KES_RATE = previousRate;
  });

  it("accepts valid signatures and rejects tampered payloads", () => {
    const body = Buffer.from(JSON.stringify({ external_reference: "CP-1-test", status: "completed" }));
    const secret = "test-forwarding-secret";
    const signature = crypto.createHmac("sha256", secret).update(body).digest("hex");
    expect(verifySwiftWalletSignature(body, signature, secret)).toBe(true);
    expect(verifySwiftWalletSignature(Buffer.from(`${body.toString()} `), signature, secret)).toBe(false);
  });
});

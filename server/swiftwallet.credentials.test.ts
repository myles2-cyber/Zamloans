import { describe, expect, it } from "vitest";

describe("Swift Wallet credentials", () => {
  it("can authenticate against the read-only fee schedule endpoint", async () => {
    const apiKey = process.env.SWIFTWALLET_API_KEY;
    expect(apiKey, "SWIFTWALLET_API_KEY must be configured").toBeTruthy();

    const response = await fetch("https://swiftwallet.co.ke/v3/fees/", {
      headers: { Authorization: `Bearer ${apiKey}` },
    });

    expect(response.ok).toBe(true);
    const payload = await response.json() as { success?: boolean };
    expect(payload.success).toBe(true);
  }, 15000);
});

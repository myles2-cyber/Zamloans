import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createContext(user: TrpcContext["user"] = null): TrpcContext {
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("loan procedures", () => {
  it("requires a managed session to read applications", async () => {
    const caller = appRouter.createCaller(createContext());
    await expect(caller.loans.mine()).rejects.toMatchObject({ code: "UNAUTHORIZED" });
  });

  it("rejects an application outside the supported amount range", async () => {
    const caller = appRouter.createCaller(createContext({
      id: 12,
      openId: "test-borrower",
      name: "Test Borrower",
      email: "borrower@example.com",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    }));

    await expect(caller.loans.submit({
      requestedAmount: 100,
      termMonths: 6,
      purpose: "Household expenses",
      monthlyIncome: 9000,
      employmentStatus: "Employed full-time",
    })).rejects.toMatchObject({ code: "BAD_REQUEST" });
  });
});

import crypto from "node:crypto";
import { COOKIE_NAME } from "../shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createLoanApplication, createSwiftWalletPayment, getApplicationByIdForUser, getLatestLoanApplicationForUser, getLoanApplicationsForUser, updateSwiftWalletPaymentByReference } from "./db";
import { initiateSwiftWalletStkPayment, usdToKes } from "./swiftwallet";

const loanApplicationInput = z.object({
  requestedAmount: z.number().min(500).max(50000),
  termMonths: z.number().int().min(3).max(24),
  purpose: z.string().min(2).max(120),
  monthlyIncome: z.number().min(0).max(1000000),
  employmentStatus: z.string().min(2).max(80),
});

const kenyaPhone = z.string().regex(/^(?:\+?254|0)7\d{8}$/, "Enter a valid Kenyan mobile number");

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  loans: router({
    latest: protectedProcedure.query(({ ctx }) => getLatestLoanApplicationForUser(ctx.user.id)),
    mine: protectedProcedure.query(({ ctx }) => getLoanApplicationsForUser(ctx.user.id)),
    get: protectedProcedure.input(z.object({ id: z.number().int().positive() })).query(({ ctx, input }) => getApplicationByIdForUser(input.id, ctx.user.id)),
    submit: protectedProcedure.input(loanApplicationInput).mutation(async ({ ctx, input }) => {
      return createLoanApplication({
        userId: ctx.user.id,
        requestedAmount: input.requestedAmount.toFixed(2),
        termMonths: input.termMonths,
        purpose: input.purpose,
        monthlyIncome: input.monthlyIncome.toFixed(2),
        employmentStatus: input.employmentStatus,
        status: "submitted",
      });
    }),
  }),
  payments: router({
    initiateApprovedServiceFee: protectedProcedure.input(z.object({
      applicationId: z.number().int().positive(),
      phoneNumber: kenyaPhone,
      origin: z.string().url(),
    })).mutation(async ({ ctx, input }) => {
      const application = await getApplicationByIdForUser(input.applicationId, ctx.user.id);
      if (!application) throw new TRPCError({ code: "NOT_FOUND", message: "Application not found" });
      if (application.status !== "approved" || !application.approvedFeeUsd) {
        throw new TRPCError({ code: "PRECONDITION_FAILED", message: "A disclosed service fee can only be collected after an application is approved and the fee is recorded in its offer." });
      }

      let origin: URL;
      try {
        origin = new URL(input.origin);
      } catch {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid application origin" });
      }
      if (origin.protocol !== "https:" && origin.hostname !== "localhost") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Payment callbacks require a secure HTTPS origin" });
      }

      const externalReference = `CP-${application.id}-${crypto.randomUUID()}`;
      const normalizedPhone = input.phoneNumber.replace(/^\+/, "").replace(/^0/, "254");
      const amountUsd = Number(application.approvedFeeUsd);
      const amountKes = usdToKes(amountUsd);
      const payment = await createSwiftWalletPayment({
        userId: ctx.user.id,
        applicationId: application.id,
        amountUsd: amountUsd.toFixed(2),
        amountKes,
        phoneNumber: normalizedPhone,
        externalReference,
        status: "initiated",
      });

      try {
        const result = await initiateSwiftWalletStkPayment({
          amountUsd,
          phoneNumber: normalizedPhone,
          externalReference,
          callbackUrl: new URL("/api/swiftwallet/callback", origin).toString(),
          customerName: ctx.user.name ?? undefined,
        });
        const updated = await updateSwiftWalletPaymentByReference(externalReference, { rawStatus: result.payload.status });
        return { paymentId: updated?.id ?? payment?.id, status: result.payload.status ?? "INITIATED", amountUsd, message: result.payload.message ?? "Payment request sent" };
      } catch (error) {
        await updateSwiftWalletPaymentByReference(externalReference, { status: "failed", rawStatus: "error" });
        throw new TRPCError({ code: "BAD_GATEWAY", message: error instanceof Error ? error.message : "Swift Wallet payment could not be initiated" });
      }
    }),
  }),
});

export type AppRouter = typeof appRouter;

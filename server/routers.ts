import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { createLoanApplication, getApplicationByIdForUser, getLatestLoanApplicationForUser, getLoanApplicationsForUser } from "./db";

const loanApplicationInput = z.object({
  requestedAmount: z.number().min(500).max(50000),
  termMonths: z.number().int().min(3).max(24),
  purpose: z.string().min(2).max(120),
  monthlyIncome: z.number().min(0).max(1000000),
  employmentStatus: z.string().min(2).max(80),
});

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
});

export type AppRouter = typeof appRouter;

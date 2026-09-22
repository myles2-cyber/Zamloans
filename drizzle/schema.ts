import { decimal, int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing the managed Manus OAuth session.
 * Passwords are never collected or stored by this application.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export const loanApplications = mysqlTable("loan_applications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  requestedAmount: decimal("requestedAmount", { precision: 12, scale: 2 }).notNull(),
  termMonths: int("termMonths").notNull(),
  purpose: varchar("purpose", { length: 120 }).notNull(),
  monthlyIncome: decimal("monthlyIncome", { precision: 12, scale: 2 }).notNull(),
  employmentStatus: varchar("employmentStatus", { length: 80 }).notNull(),
  status: mysqlEnum("status", ["submitted", "under_review", "approved", "declined"]).default("submitted").notNull(),
  decisionNote: text("decisionNote"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type InsertLoanApplication = typeof loanApplications.$inferInsert;

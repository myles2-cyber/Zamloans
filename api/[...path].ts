import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers";
import { createContext } from "../server/_core/context";
import { registerOAuthRoutes } from "../server/_core/oauth";
import { registerStorageProxy } from "../server/_core/storageProxy";
import { handleSwiftWalletCallback } from "../server/swiftwallet";

const app = express();

// Keep this route before express.json so the callback HMAC is computed over the raw body.
app.post("/api/swiftwallet/callback", express.raw({ type: "application/json" }), async (req, res) => {
  try {
    const result = await handleSwiftWalletCallback(req.body as Buffer, req.header("X-SwiftWallet-Signature"));
    res.status(result.status).json({ status: result.ok ? "ok" : "rejected" });
  } catch (error) {
    console.error("[SwiftWallet] Callback processing failed:", error);
    res.status(500).json({ status: "error" });
  }
});

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
registerStorageProxy(app);
registerOAuthRoutes(app);
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
  }),
);

export default app;

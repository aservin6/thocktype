import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { toNodeHandler } from "better-auth/node";
import { authRoutes } from "./routes/auth.ts";
import { resultsRoutes } from "./routes/results.ts";
import { meRoutes } from "./routes/me.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import pool from "./db/pool.ts";
import redis from "./db/redis.ts";
import requireEnv from "./utils/require-env.ts";
import { auth } from "./auth/auth.ts";
import { createRateLimiter } from "./middleware/rate-limit.ts";

const port = requireEnv("PORT");
const frontendOrigin = requireEnv("FRONTEND_ORIGIN");
const app = express();

const globalLimiter = createRateLimiter({
  windowMs: 900000,
  max: 100,
  keyPrefix: "ratelimit:global",
  failOpen: true,
});

app.use(cors({ origin: frontendOrigin, credentials: true }), globalLimiter);

app.all("/api/auth/*splat", toNodeHandler(auth));

app.use(express.json(), cookieParser());

// Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", resultsRoutes);
app.use("/api/v1/me", meRoutes);

// Error handling
app.use(errorHandler);

app.listen(port, () => {
  console.log(`LISTENING ON PORT: ${port}`);
});

// Closes Redis and Postgres connections before the process exits.
// The 5s timeout forces an exit if either hangs during teardown.
async function shutdown() {
  setTimeout(() => {
    console.error("Shutdown timed out, forcing exit");
    process.exit(1);
  }, 5000);

  const tasks = [
    { name: "Redis", promise: redis.quit() },
    { name: "Pool", promise: pool.end() },
  ];

  const results = await Promise.allSettled(tasks.map((t) => t.promise));

  results.forEach((result, i) => {
    const name = tasks[i].name;
    if (result.status === "fulfilled") {
      console.log(`${name} shutdown succeeded`);
    } else {
      console.error(`${name} shutdown failed:`, result.reason);
    }
  });

  const anyFailed = results.some((result) => result.status === "rejected");
  process.exit(anyFailed ? 1 : 0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.ts";
import { resultsRoutes } from "./routes/results.ts";
import { errorHandler } from "./middleware/error-handler.ts";
import redis from "./db/redis.ts";
import pool from "./db/pool.ts";

const PORT = process.env.PORT || 3000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173;
const app = express();

app.use(
  express.json(),
  cors({ origin: `http://localhost:${FRONTEND_PORT}`, credentials: true }),
  cookieParser(),
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", resultsRoutes);

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});

async function shutdown() {
  // Cleanup
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

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { authRoutes } from "./routes/auth.ts";
import { resultsRoutes } from "./routes/results.ts";
import { errorHandler } from "./middleware/error-handler.ts";

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

function shutdown() {
  // Cleanup
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

import express from "express";
import cors from "cors";
import { authRoutes } from "./src/routes/auth.ts";
import { resultsRoutes } from "./src/routes/results.ts";

const PORT = process.env.PORT || 3000;
const FRONTEND_PORT = process.env.FRONTEND_PORT || 5173;
const app = express();

app.use(express.json(), cors({ origin: `http://localhost:${FRONTEND_PORT}` }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", resultsRoutes);

app.listen(PORT, () => {
  console.log(`LISTENING ON PORT ${PORT}`);
});

import express, { Router } from "express";
import {
  getLeaderboardResults,
  createResult,
} from "../controllers/result.controller.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";

// All routes are mounted under /api/v1 in server.ts.
// Leaderboard is public; posting a result requires authentication.
const router: Router = express.Router();

router.get("/leaderboard", getLeaderboardResults);

router.post("/results", authenticateToken, createResult);

export { router as resultsRoutes };

import express, { Router } from "express";
import {
  createResult,
  getLeaderboardResults,
} from "../controllers/result.controller.ts";
import {
  authenticateSession,
  optionalAuthenticateSession,
} from "../middleware/authenticate-session.ts";
import { validateResultInput } from "../middleware/validate-result-input.ts";

// All routes are mounted under /api/v1 in server.ts.
// Leaderboard is public; posting a result requires authentication.
const router: Router = express.Router();

router.get("/leaderboard", optionalAuthenticateSession, getLeaderboardResults);

router.post("/results", authenticateSession, validateResultInput, createResult);

export { router as resultsRoutes };

import express, { Router } from "express";
import {
  getLeaderboardResults,
  postResult,
} from "../controllers/result.controller.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";

const router: Router = express.Router();

// Results prefixed with /api
router.get("/leaderboard/:mode", getLeaderboardResults);

router.post("/results", authenticateToken, postResult);

export { router as resultsRoutes };

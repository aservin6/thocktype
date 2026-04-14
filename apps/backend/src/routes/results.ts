import express, { Router } from "express";
import {
  getLeaderboardResults,
  getUsersResults,
  postResult,
} from "../controllers/result.controller.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";

const router: Router = express.Router();

router.get("/leaderboard/:mode", getLeaderboardResults);

router.get("/me/results", authenticateToken, getUsersResults);

router.post("/results", authenticateToken, postResult);

export { router as resultsRoutes };

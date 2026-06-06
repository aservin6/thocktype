import express, { Router } from "express";
import { getMe } from "../controllers/auth.controller.ts";
import {
  getUserResults,
  getUserStats,
} from "../controllers/result.controller.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";

// All routes are mounted under /api/v1/me in server.ts and require a valid access token.
const router: Router = express.Router();

router.get("/", authenticateToken, getMe);

router.get("/results", authenticateToken, getUserResults);

router.get("/stats", authenticateToken, getUserStats);

export { router as meRoutes };

import express, { Router } from "express";
import { getMe } from "../controllers/me.controller.ts";
import {
  getUserResults,
  getUserStats,
} from "../controllers/result.controller.ts";
import { authenticateSession } from "../middleware/authenticate-session.ts";

// All routes are mounted under /api/v1/me in server.ts and require a valid session.
const router: Router = express.Router();

router.get("/", authenticateSession, getMe);

router.get("/results", authenticateSession, getUserResults);

router.get("/stats", authenticateSession, getUserStats);

export { router as meRoutes };

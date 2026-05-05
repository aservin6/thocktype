import express, { Router } from "express";
import { authenticateToken } from "../middleware/authenticate-token.ts";
import { getMe } from "../controllers/auth.controller.ts";
import { getUserResults } from "../controllers/result.controller.ts";

// All routes are mounted under /api/v1/me in server.ts and require a valid access token.
const router: Router = express.Router();

router.get("/", authenticateToken, getMe);

router.get("/results", authenticateToken, getUserResults);

export { router as meRoutes };

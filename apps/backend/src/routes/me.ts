import express, { Router } from "express";
import { authenticateToken } from "../middleware/authenticate-token.ts";
import { getMe } from "../controllers/auth.controller.ts";
import { getUsersResults } from "../controllers/result.controller.ts";

const router: Router = express.Router();

// Me routes prefixed with /me
router.get("/", authenticateToken, getMe);

router.get("/results", authenticateToken, getUsersResults);

export { router as meRoutes };

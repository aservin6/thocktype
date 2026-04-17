import express, { Router } from "express";
import {
  getMe,
  refreshTokens,
  registerUser,
  signInUser,
  signOutUser,
} from "../controllers/auth.controller.ts";
import {
  validateRegisterInput,
  validateSignInInput,
} from "../middleware/validate-auth-input.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";
import { createRateLimiter } from "../middleware/rate-limit.ts";

const router: Router = express.Router();

const registerLimiter = createRateLimiter({
  windowMs: 900000,
  max: 10,
  keyPrefix: "ratelimit:register",
  failOpen: false,
});

const signinLimiter = createRateLimiter({
  windowMs: 900000,
  max: 10,
  keyPrefix: "ratelimit:signin",
  failOpen: false,
});

router.post("/register", registerLimiter, validateRegisterInput, registerUser);

router.post("/signin", signinLimiter, validateSignInInput, signInUser);

router.post("/signout", signOutUser);

router.get("/me", authenticateToken, getMe);

router.post("/refresh", refreshTokens);

export { router as authRoutes };

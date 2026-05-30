import express, { Router } from "express";
import {
  refreshTokens,
  registerUser,
  forgotPassword,
  resetPassword,
  signInUser,
  signOutUser,
} from "../controllers/auth.controller.ts";
import {
  validateForgotPasswordInput,
  validatePasswordResetInput,
  validateRegisterInput,
  validateSignInInput,
} from "../middleware/validate-auth-input.ts";
import { createRateLimiter } from "../middleware/rate-limit.ts";
import { authenticateResetToken } from "../middleware/authenticate-reset-token.ts";
import type { VerifyResetTokenResponse } from "@thockr/shared";

// All routes are mounted under /api/v1/auth in server.ts
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

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 900000,
  max: 10,
  keyPrefix: "ratelimit:forgotpassword",
  failOpen: false,
});

// Results prefixed with /api/v1/auth
router.post("/register", registerLimiter, validateRegisterInput, registerUser);

router.post("/signin", signinLimiter, validateSignInInput, signInUser);

router.post("/signout", signOutUser);

router.post("/refresh", refreshTokens);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  validateForgotPasswordInput,
  forgotPassword,
);

router.post(
  "/reset-password",
  authenticateResetToken,
  validatePasswordResetInput,
  resetPassword,
);

router.get("/verify-reset-token", authenticateResetToken, (_req, res) => {
  const responseBody: VerifyResetTokenResponse = { message: "Token is valid." };
  res.status(200).json(responseBody);
});

export { router as authRoutes };

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
  validatePasswordResetInput,
  validateRegisterInput,
  validateSignInInput,
} from "../middleware/validate-auth-input.ts";
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

const forgotPasswordLimiter = createRateLimiter({
  windowMs: 900000,
  max: 10,
  keyPrefix: "ratelimit:forgotpassword",
  failOpen: false,
});

// Results prefixed with /auth
router.post("/register", registerLimiter, validateRegisterInput, registerUser);

router.post("/signin", signinLimiter, validateSignInInput, signInUser);

router.post("/signout", signOutUser);

router.post("/refresh", refreshTokens);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);

router.post("/reset-password", validatePasswordResetInput, resetPassword);

export { router as authRoutes };

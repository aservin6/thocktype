import express, { Router } from "express";
import {
  getMe,
  registerUser,
  signInUser,
  signOutUser,
} from "../controllers/auth.controller.ts";
import {
  validateRegisterInput,
  validateSignInInput,
} from "../middleware/validate-auth-input.ts";
import { authenticateToken } from "../middleware/authenticate-token.ts";

const router: Router = express.Router();

router.post("/register", validateRegisterInput, registerUser);

router.post("/signin", validateSignInInput, signInUser);

router.post("/signout", signOutUser);

router.get("/me", authenticateToken, getMe);

export { router as authRoutes };

import express from "express";
import { registerUser, signInUser } from "../controllers/auth.controller.ts";
import {
  validateRegisterInput,
  validateSignInInput,
} from "../middleware/validate-auth-input.ts";

const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);

router.post("/signin", validateSignInInput, signInUser);

router.post("/signout", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

router.get("/me", (req, res) => {
  res.status(501).json({
    error: "Not Implemented",
    message: "Route has not been implemented yet.",
  });
});

export { router as authRoutes };

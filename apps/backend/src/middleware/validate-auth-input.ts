import {
  forgotPasswordRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
  signInRequestSchema,
} from "@thockr/shared";
import { validateBody } from "./validate-body.ts";
import type { RequestHandler } from "express";

export const validateRegisterInput: RequestHandler = validateBody(
  registerRequestSchema,
  "Invalid register input.",
);

export const validateSignInInput: RequestHandler = validateBody(
  signInRequestSchema,
  "Invalid sign in input.",
);

export const validatePasswordResetInput: RequestHandler = validateBody(
  resetPasswordRequestSchema,
  "Invalid reset password input.",
);

export const validateForgotPasswordInput: RequestHandler = validateBody(
  forgotPasswordRequestSchema,
  "Invalid email input.",
);

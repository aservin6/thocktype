import {
  forgotPasswordRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
  signInRequestSchema,
} from "@thocktype/shared";
import type { RequestHandler } from "express";
import { validateBody } from "./validate-body.ts";

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

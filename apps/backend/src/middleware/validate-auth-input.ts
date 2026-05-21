import {
  forgotPasswordRequestSchema,
  registerRequestSchema,
  resetPasswordRequestSchema,
  signInRequestSchema,
} from "@thockr/shared";
import type { Request, Response, NextFunction } from "express";

export function validateRegisterInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = registerRequestSchema.safeParse(req.body);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Invalid register input.";
    res.status(400).json({ message });
    return;
  }
  req.body = result.data;
  next();
}

export function validateSignInInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = signInRequestSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid sign in input.";
    res.status(400).json({ message });
    return;
  }
  req.body = result.data;
  next();
}

export function validatePasswordResetInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = resetPasswordRequestSchema.safeParse(req.body);

  if (!result.success) {
    const message =
      result.error.issues[0]?.message ?? "Invalid reset password input.";
    res.status(400).json({ message });
    return;
  }
  req.body = result.data;
  next();
}

export function validateForgotPasswordInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const result = forgotPasswordRequestSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid email input.";
    res.status(400).json({ message });
    return;
  }
  req.body = result.data;
  next();
}

import {
  forgotPasswordRequestSchema,
  registerRequestSchema,
  signInRequestSchema,
} from "@typing-test/shared";
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
) {
  const { password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    res.status(400).json({ message: "Password fields do not match" });
    return;
  }

  // Same rules as registration. 72-char max is bcrypt's effective input limit.
  if (
    password.length < 8 ||
    password.length > 72 ||
    !/[A-Z]/.test(password) ||
    !/[0-9]/.test(password) ||
    !/[!@#$%^&*]/.test(password)
  ) {
    res.status(400).json({ message: "Password does not meet requirements" });
    return;
  }
  next();
}

export function validateForgotPasswordInput(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const result = forgotPasswordRequestSchema.safeParse(req.body);

  if (!result.success) {
    const message = result.error.issues[0]?.message ?? "Invalid email input.";
    res.status(400).json({ message });
    return;
  }
  req.body = result.data;
  next();
}

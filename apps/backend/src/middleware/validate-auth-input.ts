import type { Request, Response, NextFunction } from "express";
import { selectUserByEmail } from "../repositories/user.repository.ts";

export function validateRegisterInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailIsValid = emailRegex.test(email) && email.length < 255;

  // Email validation
  if (!emailIsValid) {
    res.status(400).json({ message: "Not a valid email address" });
    return;
  }

  // 72-char max is bcrypt's effective input limit. Anything beyond is silently truncated by the algorithm.
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

export function validateSignInInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ message: "Confirm sign in details and try again" });
    return;
  }

  next();
}

export async function validatePasswordResetInput(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
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

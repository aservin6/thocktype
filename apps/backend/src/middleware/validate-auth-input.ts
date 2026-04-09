import type { Request, Response, NextFunction } from "express";

export function validateRegisterInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { email, password } = req.body;

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const emailIsValid = emailRegex.test(email);

  // Email validation
  if (!emailIsValid) {
    res.status(400).json({ message: "Not a valid email address" });
    return;
  }

  // Password validation
  if (
    password.length < 8 ||
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

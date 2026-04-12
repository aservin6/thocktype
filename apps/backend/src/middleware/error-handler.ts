import type { Request, Response, NextFunction } from "express";

const errorCodes: Record<string, number> = {
  "User already exists": 409,
  "Confirm sign in details and try again": 401,
  "Could not refresh tokens": 401,
  "No token found. Unauthorized access": 401,
};

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const statusCode = errorCodes[err.message] || 500;
  if (statusCode !== 500) {
    res.status(statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "A server side error occurred" });
  }
}

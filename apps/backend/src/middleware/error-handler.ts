import type { Request, Response, NextFunction } from "express";

// Maps known service-layer error messages to HTTP status codes.
// Anything not listed here is treated as an unexpected 500 and the message is scrubbed from the response.
const errorCodes: Record<string, number> = {
  "User already exists": 409,
  "Confirm sign in details and try again": 401,
  "Could not refresh tokens": 401,
  "No token found. Unauthorized access": 401,
  "Unauthorized request": 401,
  "User does not exist": 401,
  "Result data is invalid": 400,
  "Email sent": 200,
};

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  console.error(err);
  const statusCode = errorCodes[err.message] || 500;
  if (statusCode !== 500) {
    res.status(statusCode).json({ message: err.message });
  } else {
    res.status(500).json({ message: "A server side error occurred" });
  }
}

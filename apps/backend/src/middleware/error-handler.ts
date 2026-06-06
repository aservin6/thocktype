import type { NextFunction, Request, Response } from "express";
import { sendErrorResponse } from "../utils/send-error-response.ts";

// Maps known service-layer error messages to HTTP status codes.
// Anything not listed here is treated as an unexpected 500 and the message is scrubbed from the response.
const errorCodes: Record<string, number> = {
  "User already exists.": 409,
  "Confirm sign in details and try again.": 401,
  "Refresh token not found.": 401,
  "Refresh token has expired.": 401,
  "No token found. Unauthorized access.": 401,
  "Unauthorized request.": 401,
  "User does not exist.": 401,
  "Result data is invalid.": 400,
  "Email sent.": 200,
};

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) {
  console.error(err);
  const statusCode = errorCodes[err.message] || 500;
  if (statusCode !== 500) {
    sendErrorResponse(res, statusCode, {
      message: err.message,
      code: "REQUEST_ERROR",
    });
  } else {
    sendErrorResponse(res, 500, {
      message: "A server side error occurred.",
      code: "INTERNAL_SERVER_ERROR",
    });
  }
}

import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { selectUserById } from "../repositories/user.repository.ts";
import { ACCESS_TOKEN_COOKIE } from "../utils/cookies.ts";
import requireEnv from "../utils/require-env.ts";
import { sendErrorResponse } from "../utils/send-error-response.ts";

const { TokenExpiredError, JsonWebTokenError } = jwt;

const jwtSecret = requireEnv("JWT_SECRET");

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies[ACCESS_TOKEN_COOKIE];

  if (!token) {
    sendErrorResponse(res, 401, {
      message: "No token provided.",
      code: "AUTH_REQUIRED",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, jwtSecret) as { id: string };
    const user = await selectUserById(payload.id);
    if (!user) {
      sendErrorResponse(res, 401, {
        message: "User not found.",
        code: "USER_NOT_FOUND",
      });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified,
      created_at: user.created_at.toISOString(),
    };

    next();
  } catch (err) {
    // TokenExpiredError is a subclass of JsonWebTokenError, so order matters here.
    // The client uses the "Token expired." message to know a refresh is worth attempting.
    if (err instanceof TokenExpiredError) {
      sendErrorResponse(res, 401, {
        message: "Token expired.",
        code: "TOKEN_EXPIRED",
      });
      return;
    }
    if (err instanceof JsonWebTokenError) {
      sendErrorResponse(res, 401, {
        message: "Invalid token.",
        code: "INVALID_TOKEN",
      });
      return;
    }
    next(err);
  }
}

export async function optionalAuthenticateToken(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies[ACCESS_TOKEN_COOKIE];

  if (!token) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(token, jwtSecret) as { id: string };
    const user = await selectUserById(payload.id);

    if (user) {
      req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        email_verified: user.email_verified,
        created_at: user.created_at.toISOString(),
      };
    }
  } catch {
    // Ignore auth errors on public routes; request continues as guest.
  }
  next();
}

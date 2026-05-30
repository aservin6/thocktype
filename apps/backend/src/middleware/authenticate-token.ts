import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import requireEnv from "../utils/require-env.ts";
import { selectUserById } from "../repositories/user.repository.ts";
import { sendErrorResponse } from "../utils/send-error-response.ts";

const { TokenExpiredError, JsonWebTokenError } = jwt;

const JWT_SECRET = requireEnv("JWT_SECRET");

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies.access_token;

  if (!token) {
    sendErrorResponse(res, 401, {
      message: "No token provided.",
      code: "AUTH_REQUIRED",
    });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
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
  const token = req.cookies.access_token;

  if (!token) {
    next();
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
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

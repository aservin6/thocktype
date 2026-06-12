import type { PublicUser } from "@thocktype/shared";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth/auth.ts";
import { sendErrorResponse } from "../utils/send-error-response.ts";

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    username: user.name,
    email: user.email,
    email_verified: user.emailVerified,
    created_at: user.createdAt.toISOString(),
  };
}

export async function authenticateSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session) {
      sendErrorResponse(res, 401, {
        message: "Unauthorized request.",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    req.user = toPublicUser(session.user);
    next();
  } catch (err) {
    next(err);
  }
}

export async function optionalAuthenticateSession(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (session) {
      req.user = toPublicUser(session.user);
    }
  } catch {
    // Ignore auth errors on public routes; request continues as guest.
  }
  next();
}

import { authUserToPublicUser } from "@thocktype/shared";
import { fromNodeHeaders } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";
import { auth } from "../auth/auth.ts";
import { sendErrorResponse } from "../utils/send-error-response.ts";

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

    req.user = authUserToPublicUser(session.user);
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
      req.user = authUserToPublicUser(session.user);
    }
  } catch {
    // Ignore auth errors on public routes; request continues as guest.
  }
  next();
}

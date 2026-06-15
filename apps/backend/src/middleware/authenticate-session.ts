import type { NextFunction, Request, Response } from "express";
import { getRequestUser } from "../auth/session.ts";
import { sendErrorResponse } from "../utils/send-error-response.ts";

export async function authenticateSession(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const user = await getRequestUser(req);

    if (!user) {
      sendErrorResponse(res, 401, {
        message: "Unauthorized request.",
        code: "AUTH_REQUIRED",
      });
      return;
    }

    req.user = user;
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
    const user = await getRequestUser(req);

    if (user) {
      req.user = user;
    }
  } catch {
    // Ignore auth errors on public routes; request continues as guest.
  }
  next();
}

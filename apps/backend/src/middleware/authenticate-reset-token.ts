import type { Request, Response, NextFunction } from "express";
import {
  deletePasswordResetToken,
  selectPasswordResetToken,
} from "../repositories/password-reset-token.repository.ts";
import crypto from "crypto";
import { sendErrorResponse } from "../utils/send-error-response.ts";

export async function authenticateResetToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.query.token as string;
  if (!token) {
    sendErrorResponse(res, 401, {
      message: "Unauthorized access.",
      code: "AUTH_REQUIRED",
    });
    return;
  }
  // Hash the raw token from the URL before querying -- only the hash is stored in the DB.
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const storedToken = await selectPasswordResetToken(hashedToken);
    if (!storedToken) {
      sendErrorResponse(res, 401, {
        message: "Unauthorized access.",
        code: "INVALID_RESET_TOKEN",
      });
      return;
    }
    if (new Date() > new Date(storedToken.expires_at)) {
      await deletePasswordResetToken(storedToken.id);
      sendErrorResponse(res, 401, {
        message: "Reset token expired.",
        code: "RESET_TOKEN_EXPIRED",
      });
      return;
    }
    // Attach to the request so downstream handlers can access user_id and token id without re-querying.
    req.passwordResetToken = storedToken;
    next();
  } catch (err) {
    next(err);
  }
}

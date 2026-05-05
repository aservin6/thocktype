import type { Request, Response, NextFunction } from "express";
import {
  deletePasswordResetToken,
  selectPasswordResetToken,
} from "../repositories/password-reset-token.repository.ts";
import crypto from "crypto";

export async function authenticateResetToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.query.token as string;
  if (!token) {
    res.status(401).json({ message: "Unauthorized access" });
    return;
  }
  // Hash the raw token from the URL before querying -- only the hash is stored in the DB.
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const storedToken = await selectPasswordResetToken(hashedToken);
    if (!storedToken) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }
    if (new Date() > new Date(storedToken.expires_at)) {
      await deletePasswordResetToken(storedToken.id);
      res.status(401).json({ message: "Reset token expired" });
      return;
    }
    // Attach to the request so downstream handlers can access user_id and token id without re-querying.
    req.passwordResetToken = storedToken;
    next();
  } catch (err) {
    next(err);
  }
}

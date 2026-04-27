import type { Request, Response, NextFunction } from "express";
import {
  deletePasswordResetToken,
  selectPasswordResetToken,
} from "../repositories/password_reset_token.repository.ts";
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
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  try {
    const dbToken = await selectPasswordResetToken(hashedToken);
    if (!dbToken) {
      res.status(401).json({ message: "Unauthorized access" });
      return;
    }
    if (new Date() > new Date(dbToken.expires_at)) {
      await deletePasswordResetToken(dbToken.id);
      res.status(401).json({ message: "Reset token expired" });
      return;
    }
    req.passwordResetToken = dbToken;
    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: "Invalid token signature" });
      return;
    }
  }
}

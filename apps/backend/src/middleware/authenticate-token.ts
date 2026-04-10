import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import requireEnv from "../utils/require-env.ts";
import { findUserById } from "../repositories/user.repository.ts";

const JWT_SECRET = requireEnv("JWT_SECRET");

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies.auth_token;

  if (!token) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await findUserById(payload.id);
    if (!user) {
      res.status(401).json({ message: "User not found" });
      return;
    }

    req.user = {
      id: user.id,
      username: user.username,
      email: user.email,
      email_verified: user.email_verified,
      created_at: user.created_at,
    };

    next();
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ message: "Invalid token signature" });
      return;
    }
  }
}

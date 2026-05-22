import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import requireEnv from "../utils/require-env.ts";
import { selectUserById } from "../repositories/user.repository.ts";

const { TokenExpiredError, JsonWebTokenError } = jwt;

const JWT_SECRET = requireEnv("JWT_SECRET");

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies.access_token;

  if (!token) {
    res.status(401).json({ message: "No token provided." });
    return;
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { id: string };
    const user = await selectUserById(payload.id);
    if (!user) {
      res.status(401).json({ message: "User not found." });
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
      res.status(401).json({ message: "Token expired." });
      return;
    }
    if (err instanceof JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token." });
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

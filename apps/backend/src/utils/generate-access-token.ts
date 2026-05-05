import jwt from "jsonwebtoken";
import requireEnv from "./require-env.ts";

const JWT_SECRET = requireEnv("JWT_SECRET");

// Short-lived by design. Refresh tokens handle session continuity.
export default function generateAccessToken(userId: string): string {
  const token = jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "15m" });
  return token;
}

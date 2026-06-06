import jwt from "jsonwebtoken";
import requireEnv from "./require-env.ts";

const jwtSecret = requireEnv("JWT_SECRET");

// Short-lived by design. Refresh tokens handle session continuity.
export default function generateAccessToken(userId: string): string {
  const token = jwt.sign({ id: userId }, jwtSecret, { expiresIn: "15m" });
  return token;
}

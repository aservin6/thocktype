import jwt from "jsonwebtoken";
import requireEnv from "./require-env.ts";

const JWT_SECRET = requireEnv("JWT_SECRET");

export default function generateToken(userId: string): string {
  // Create payload for JWT token
  const userPayload = {
    id: userId,
  };

  // Token config
  const token = jwt.sign(userPayload, JWT_SECRET, {
    expiresIn: "1h",
  });

  return token;
}

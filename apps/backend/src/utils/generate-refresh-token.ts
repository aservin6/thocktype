import crypto from "crypto";

export default function generateRefreshToken(): {
  token: string;
  expiresAt: Date;
} {
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);

  return { token, expiresAt };
}

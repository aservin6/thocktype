import crypto from "crypto";

export default function generateResetToken(): {
  token: string;
  expiresAt: Date;
} {
  const token = crypto.randomBytes(64).toString("hex");

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  return { token, expiresAt };
}

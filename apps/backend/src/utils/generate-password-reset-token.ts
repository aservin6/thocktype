import crypto from "crypto";

// The raw token is sent to the user via email. Only the hash is stored in the
// DB, so a database leak does not yield usable reset links.
export default function generatePasswordResetToken(): {
  token: string;
  hashedToken: string;
  expiresAt: Date;
} {
  const token = crypto.randomBytes(64).toString("hex");
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 15);

  return { token, hashedToken, expiresAt };
}

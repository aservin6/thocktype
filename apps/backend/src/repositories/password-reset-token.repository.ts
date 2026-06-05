import pool from "../db/pool.ts";
import type { PasswordResetToken } from "../types/token.ts";

export async function insertPasswordResetToken(
  userId: string,
  token: string,
  expiresAt: Date,
): Promise<PasswordResetToken> {
  const query = `
    INSERT INTO password_reset_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token, expires_at, created_at
`;

  const values = [userId, token, expiresAt];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0];
}

// Looks up by the hashed token. The raw token only ever exists in the email sent to the user.
export async function selectPasswordResetToken(
  hashedToken: string,
): Promise<PasswordResetToken | null> {
  const query = `
    SELECT id, user_id, token, expires_at, created_at
    FROM password_reset_tokens
    WHERE token = $1
`;
  const values = [hashedToken];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0] ?? null;
}

export async function deletePasswordResetToken(id: string): Promise<void> {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE id = $1
`;
  const values = [id];
  await pool.query(query, values);
}

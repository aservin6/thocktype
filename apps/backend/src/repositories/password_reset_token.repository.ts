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
    RETURNING *
`;

  const values = [userId, token, expiresAt];
  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function selectPasswordResetToken(
  token: string,
): Promise<PasswordResetToken | null> {
  const query = `
    SELECT * FROM password_reset_tokens
    WHERE token = $1
`;
  const values = [token];
  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
}

export async function deletePasswordResetToken(token: string): Promise<void> {
  const query = `
    DELETE FROM password_reset_tokens
    WHERE token = $1
`;
  const values = [token];
  await pool.query(query, values);
}

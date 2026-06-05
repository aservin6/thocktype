import pool from "../db/pool.ts";
import type { RefreshToken } from "../types/token.ts";

export async function insertRefreshToken(
  userId: string,
  token: string,
  expiresAt: Date,
): Promise<RefreshToken> {
  const query = `
    INSERT INTO refresh_tokens (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token, expires_at, created_at
`;

  const values = [userId, token, expiresAt];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0];
}

export async function selectRefreshToken(
  token: string,
): Promise<RefreshToken | null> {
  const query = `
    SELECT id, user_id, token, expires_at, created_at
    FROM refresh_tokens
    WHERE token = $1
`;

  const values = [token];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0] ?? null;
}

export async function deleteRefreshToken(token: string): Promise<void> {
  const query = `
    DELETE FROM refresh_tokens
    WHERE token = $1
`;

  const values = [token];
  await pool.query(query, values);
}

// Used to revoke all active sessions for a user, e.g. on password change.
export async function deleteAllUserRefreshTokens(
  userId: string,
): Promise<void> {
  const query = `
    DELETE FROM refresh_tokens
    WHERE user_id = $1
`;

  const values = [userId];
  await pool.query(query, values);
}

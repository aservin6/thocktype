import pool from "../db/pool.ts";
import type { Session } from "../types/token.ts";

export async function createSession(
  userId: string,
  token: string,
  expiresAt: Date,
): Promise<Session> {
  const query = `
    INSERT INTO sessions (user_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token, expires_at, created_at
`;

  const values = [userId, token, expiresAt];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0];
}

export async function findSessionByToken(
  token: string,
): Promise<Session | null> {
  const query = `
    SELECT id, user_id, token, expires_at, created_at
    FROM sessions
    WHERE token = $1
`;

  const values = [token];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0] ?? null;
}

export async function deleteSession(token: string): Promise<void> {
  const query = `
    DELETE FROM sessions
    WHERE token = $1
`;

  const values = [token];
  await pool.query(query, values);
}

// Used to revoke all active sessions for a user, e.g. on password change.
export async function deleteUserSessions(userId: string): Promise<void> {
  const query = `
    DELETE FROM sessions
    WHERE user_id = $1
`;

  const values = [userId];
  await pool.query(query, values);
}

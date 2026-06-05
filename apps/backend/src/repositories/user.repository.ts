import pool from "../db/pool.ts";
import type { User } from "../types/user.ts";

interface UserCreationDetails {
  email: string;
  username: string;
  password_hash: string;
}

export async function insertUser({
  email,
  username,
  password_hash,
}: UserCreationDetails): Promise<User> {
  const query = `
    INSERT INTO users (email, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING id, username, email, password_hash, email_verified, created_at;
`;
  const values = [email, username, password_hash];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0];
}

export async function selectUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT id, username, email, password_hash, email_verified, created_at
    FROM users
    WHERE email = $1
`;
  const values = [email];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0] ?? null;
}

export async function selectUserById(id: string): Promise<User | null> {
  const query = `
    SELECT id, username, email, password_hash, email_verified, created_at
    FROM users
    WHERE id = $1
`;
  const values = [id];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0] ?? null;
}

export async function updateUserPassword(
  userId: string,
  hashedPassword: string,
): Promise<void> {
  const query = `
    UPDATE users
    SET password_hash = $1
    WHERE id = $2
`;

  const values = [hashedPassword, userId];
  await pool.query(query, values);
}

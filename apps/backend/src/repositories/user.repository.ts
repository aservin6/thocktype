import pool from "../db/pool.ts";
import type { User } from "../types/user.ts";

// Minimum details needed for user creation
interface userCreationDetails {
  email: string;
  username: string;
  password_hash: string;
}

export async function insertUser({
  email,
  username,
  password_hash,
}: userCreationDetails): Promise<User> {
  const query = `
    INSERT INTO users (email, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *;
`;
  const values = [email, username, password_hash];
  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function selectUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT * FROM users
    WHERE email = $1
`;
  const values = [email];
  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
}

export async function selectUserById(id: string): Promise<User | null> {
  const query = `
    SELECT * FROM users
    WHERE id = $1
`;
  const values = [id];
  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
}

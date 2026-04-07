import pool from "../db/pool.ts";
import { User } from "../types/user.ts";

export async function createUser(
  email: string,
  username: string,
  password_hash: string,
): Promise<User> {
  const query = `
    INSERT INTO users (email, username, password_hash)
    VALUES ($1, $2, $3)
    RETURNING *;
`;
  const values = [email, username, password_hash];
  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const query = `
    SELECT * FROM users
    WHERE email = $1
`;
  const values = [email];
  const result = await pool.query(query, values);

  return result.rows[0] ?? null;
}

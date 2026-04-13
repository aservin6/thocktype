import type { Result } from "../types/result.ts";
import type { resultCreationDetails } from "../services/result.service.ts";
import pool from "../db/pool.ts";

export async function createResultDb({
  user_id,
  wpm,
  time_elapsed,
  accuracy,
  mode,
  mode_value,
  correct,
  incorrect,
}: resultCreationDetails): Promise<Result> {
  const query = `
    INSERT INTO results (user_id, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *
`;

  const values = [
    user_id,
    wpm,
    time_elapsed,
    accuracy,
    mode,
    mode_value,
    correct,
    incorrect,
  ];
  const result = await pool.query(query, values);

  return result.rows[0];
}

export async function findUsersResults(user_id: string): Promise<Result[]> {
  const query = `
    SELECT * FROM results
    WHERE user_id = $1
`;

  const values = [user_id];
  const result = await pool.query(query, values);

  return result.rows;
}

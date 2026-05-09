import type {
  LeaderboardResult,
  Result,
  ResultCreationDetails,
} from "../types/result.ts";
import pool from "../db/pool.ts";

export async function insertResult({
  user_id,
  wpm,
  time_elapsed,
  accuracy,
  mode,
  mode_value,
  correct,
  incorrect,
}: ResultCreationDetails): Promise<Result> {
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
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0];
}

export async function selectResultsByUser(user_id: string): Promise<Result[]> {
  const query = `
    SELECT * FROM results
    WHERE user_id = $1
`;

  const values = [user_id];
  const queryResult = await pool.query(query, values);

  return queryResult.rows;
}

export async function selectLeaderboardResults(
  mode: string,
  mode_value: number,
  page: number,
  limit: number,
): Promise<LeaderboardResult[]> {
  const offset = (page - 1) * limit;
  const query = `
    SELECT results.id, username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, results.created_at FROM results
    INNER JOIN users
    ON results.user_id = users.id
    WHERE mode = $1 AND mode_value = $2
    ORDER BY wpm DESC
    LIMIT $3 OFFSET $4
`;

  const values = [mode, mode_value, limit, offset];
  const queryResult = await pool.query(query, values);

  return queryResult.rows;
}

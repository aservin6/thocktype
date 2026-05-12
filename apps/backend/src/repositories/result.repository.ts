import type {
  LeaderboardResult,
  ModeStats,
  Result,
  ResultCreationDetails,
  UserStats,
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

export async function selectUserStats(user_id: string): Promise<UserStats> {
  const overallQuery = `
    SELECT MAX(wpm) AS best_wpm, ROUND(AVG(wpm)::numeric, 1) AS avg_wpm, ROUND(AVG(accuracy)::numeric, 1) AS avg_accuracy, COUNT(*) AS total_tests
    FROM results
    WHERE user_id = $1
`;
  const byModeQuery = `
    SELECT mode, mode_value, MAX(wpm) AS best_wpm, ROUND(AVG(wpm)::numeric, 1) AS avg_wpm, ROUND(AVG(accuracy)::numeric, 1) AS avg_accuracy, COUNT(*) AS test_count
    FROM results
    WHERE user_id = $1
    GROUP BY (mode, mode_value)
`;

  const [overallResult, byModeResult] = await Promise.all([
    pool.query(overallQuery, [user_id]),
    pool.query(byModeQuery, [user_id]),
  ]);

  return {
    overall: overallResult.rows[0],
    by_mode: byModeResult.rows as ModeStats[],
  };
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

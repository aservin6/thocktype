import type { Mode } from "@thocktype/shared";
import pool from "../db/pool.ts";
import type {
  LeaderboardEntry,
  ModeStats,
  Result,
  ResultCreationDetails,
  UserStats,
} from "../types/result.ts";

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
    RETURNING id, user_id, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, created_at
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
    SELECT id, user_id, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, created_at
    FROM results
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
  mode: Mode,
  mode_value: number,
  page: number,
  limit: number,
): Promise<LeaderboardEntry[]> {
  const offset = (page - 1) * limit;
  const query = `
    WITH ranked_user_results AS (
      SELECT results.id, users.username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, results.created_at,
      ROW_NUMBER() OVER (
          PARTITION BY results.user_id
          ORDER BY wpm DESC, accuracy DESC, time_elapsed ASC, results.created_at ASC
      ) AS personal_ranking
      FROM results
      INNER JOIN users
      ON results.user_id = users.id
      WHERE mode = $1 AND mode_value = $2
    ), 
    user_best_results AS (
      SELECT id, username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, created_at,
      ROW_NUMBER() OVER (
          ORDER BY wpm DESC, accuracy DESC, time_elapsed ASC, created_at ASC
      ) AS rank
      FROM ranked_user_results
      WHERE personal_ranking = 1
    )
    SELECT rank, id, username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, created_at
    FROM user_best_results
    ORDER BY rank ASC
    LIMIT $3 OFFSET $4
`;

  const values = [mode, mode_value, limit, offset];
  const queryResult = await pool.query(query, values);

  return queryResult.rows;
}

export async function selectLeaderboardEntryCount(
  mode: Mode,
  mode_value: number,
): Promise<number> {
  const query = `
    SELECT COUNT(DISTINCT user_id) AS total
    FROM results
    WHERE mode = $1 AND mode_value = $2
`;
  const values = [mode, mode_value];
  const queryResult = await pool.query(query, values);
  const total = parseInt(queryResult.rows[0].total, 10);
  return total;
}

export async function selectLeaderboardEntryByUser(
  mode: Mode,
  mode_value: number,
  user_id: string,
): Promise<LeaderboardEntry | null> {
  const query = `
    WITH ranked_user_results AS (
      SELECT results.id, results.user_id, users.username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, results.created_at,
      ROW_NUMBER() OVER (
          PARTITION BY results.user_id
          ORDER BY wpm DESC, accuracy DESC, time_elapsed ASC, results.created_at ASC
      ) AS personal_ranking
      FROM results
      INNER JOIN users
      ON results.user_id = users.id
      WHERE mode = $1 AND mode_value = $2
    ), 
    user_best_results AS (
      SELECT id, user_id, username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, created_at,
      ROW_NUMBER() OVER (
          ORDER BY wpm DESC, accuracy DESC, time_elapsed ASC, created_at ASC
      ) AS rank
      FROM ranked_user_results
      WHERE personal_ranking = 1
    )
    SELECT rank, id, username, wpm, time_elapsed, accuracy, mode, mode_value, correct, incorrect, created_at
    FROM user_best_results
    WHERE user_id = $3
`;

  const values = [mode, mode_value, user_id];
  const queryResult = await pool.query(query, values);

  return queryResult.rows[0] ?? null;
}

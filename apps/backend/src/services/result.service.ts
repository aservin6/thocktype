import {
  insertResult,
  selectLeaderboardResults,
} from "../repositories/result.repository.ts";
import { selectUserById } from "../repositories/user.repository.ts";
import type { LeaderboardResult, Result } from "../types/result.ts";
import redis from "../db/redis.ts";

const CACHE_TTL = 300;
const LEADERBOARD_TOP_N = 500;

// Cache-aside pattern: check Redis → miss → query Postgres → store in Redis → return
// On Redis failure: fall through to Postgres (fail-open)
// Pagination is done in-memory by slicing the cached array
export async function getLeaderboard(
  mode: string,
  page: number,
  limit: number,
): Promise<LeaderboardResult[]> {
  const cacheKey = `leaderboard:${mode}`;
  let results = null;

  try {
    const value = await redis.get(cacheKey);

    if (value) {
      results = JSON.parse(value);
      console.log("Cache hit");
    } else {
      results = await selectLeaderboardResults(mode, 1, LEADERBOARD_TOP_N);
      await redis.set(cacheKey, JSON.stringify(results), "EX", CACHE_TTL);
      console.log("Cache miss");
    }
  } catch (err) {
    console.error("Redis read failed, falling through to DB: ", err);
    return await selectLeaderboardResults(mode, page, limit);
  }

  return results.slice(limit * (page - 1), limit * page);
}

export interface resultCreationDetails {
  user_id: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: string;
  mode_value: number;
  correct: number;
  incorrect: number;
}

export async function submitResult({
  user_id,
  wpm,
  time_elapsed,
  accuracy,
  mode,
  mode_value,
  correct,
  incorrect,
}: resultCreationDetails): Promise<Result> {
  const user = await selectUserById(user_id);
  if (!user) throw new Error("User does not exist");
  if (wpm < 0 || accuracy < 0) throw new Error("Result data is invalid");

  const result = await insertResult({
    user_id,
    wpm,
    time_elapsed,
    accuracy,
    mode,
    mode_value,
    correct,
    incorrect,
  });

  const cacheKey = `leaderboard:${mode}`;
  try {
    await redis.del(cacheKey);
  } catch (err) {
    console.error("Cache invalidation failed: ", err);
  }

  return result;
}

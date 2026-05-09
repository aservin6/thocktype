import {
  insertResult,
  selectLeaderboardResults,
} from "../repositories/result.repository.ts";
import { selectUserById } from "../repositories/user.repository.ts";
import type {
  LeaderboardResult,
  Result,
  ResultCreationDetails,
} from "../types/result.ts";
import redis from "../db/redis.ts";

const CACHE_TTL = 300;
// Cap the number of entries fetched from the DB and held in Redis per mode.
// Pagination is then served by slicing this in-memory array rather than hitting the DB on every page.
const LEADERBOARD_TOP_N = 500;

// Cache-aside: check Redis first, fall back to Postgres on miss or Redis failure (fail-open).
export async function getLeaderboard(
  mode: string,
  mode_value: number,
  page: number,
  limit: number,
): Promise<LeaderboardResult[]> {
  const cacheKey = `leaderboard:${mode}:${mode_value}`;
  let results = null;

  try {
    const cached = await redis.get(cacheKey);

    if (cached) {
      results = JSON.parse(cached);
      console.log("Cache hit");
    } else {
      results = await selectLeaderboardResults(
        mode,
        mode_value,
        1,
        LEADERBOARD_TOP_N,
      );
      await redis.set(cacheKey, JSON.stringify(results), "EX", CACHE_TTL);
      console.log("Cache miss");
    }
  } catch (err) {
    console.error("Redis read failed, falling through to DB: ", err);
    return await selectLeaderboardResults(mode, mode_value, page, limit);
  }

  return results.slice(limit * (page - 1), limit * page);
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
}: ResultCreationDetails): Promise<Result> {
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

  // Invalidate the leaderboard cache for this mode so the next read reflects the new result.
  const cacheKey = `leaderboard:${mode}:${mode_value}`;
  try {
    await redis.del(cacheKey);
  } catch (err) {
    console.error("Cache invalidation failed: ", err);
  }

  return result;
}

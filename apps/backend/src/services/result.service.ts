import {
  insertResult,
  selectLeaderboardResults,
  selectLeaderboardEntryCount,
  selectLeaderboardEntryByUser,
} from "../repositories/result.repository.ts";
import { selectUserById } from "../repositories/user.repository.ts";
import type { Result, ResultCreationDetails } from "../types/result.ts";
import redis from "../db/redis.ts";
import type {
  LeaderboardEntry,
  LeaderboardResponse,
  Mode,
} from "@thockr/shared";

const CACHE_TTL = 300;
// Cap the number of entries fetched from the DB and held in Redis per mode.
// Pagination is then served by slicing this in-memory array rather than hitting the DB on every page.
const LEADERBOARD_TOP_N = 500;

// Cache-aside: check Redis first, fall back to Postgres on miss or Redis failure (fail-open).
export async function getLeaderboard(
  mode: Mode,
  mode_value: number,
  page: number,
  limit: number,
  userId?: string,
): Promise<LeaderboardResponse> {
  const topCacheKey = `leaderboard:v2:${mode}:${mode_value}:top`;
  const countCacheKey = `leaderboard:v2:${mode}:${mode_value}:count`;
  let results: LeaderboardEntry[] = [];
  let currentUserEntry: LeaderboardEntry | null = null;
  let total: number;

  if (userId) {
    currentUserEntry = await selectLeaderboardEntryByUser(
      mode,
      mode_value,
      userId,
    );
  }

  try {
    const cached = await redis.get(countCacheKey);
    if (cached) {
      total = Number(cached);
      console.log("Count: Cache hit");
    } else {
      total = await selectLeaderboardEntryCount(mode, mode_value);
      await redis.set(countCacheKey, total.toString(), "EX", CACHE_TTL);
      console.log("Count: Cache miss");
    }
  } catch (err) {
    console.error("Redis count read failed, falling through to DB: ", err);
    total = await selectLeaderboardEntryCount(mode, mode_value);
  }

  const totalPages = Math.ceil(total / limit);
  try {
    const cached = await redis.get(topCacheKey);
    if (cached) {
      results = JSON.parse(cached);
      console.log("Top: Cache hit");
    } else {
      results = await selectLeaderboardResults(
        mode,
        mode_value,
        1,
        LEADERBOARD_TOP_N,
      );
      await redis.set(topCacheKey, JSON.stringify(results), "EX", CACHE_TTL);
      console.log("Top: Cache miss");
    }
  } catch (err) {
    console.error("Redis top read failed, falling through to DB: ", err);
    const fallbackResults = await selectLeaderboardResults(
      mode,
      mode_value,
      page,
      limit,
    );
    return {
      data: fallbackResults,
      pagination: { page, limit, total, totalPages },
      currentUserEntry,
      message: "Successfully fetched leaderboard results.",
    };
  }
  return {
    data: results.slice(limit * (page - 1), limit * page),
    pagination: { page, limit, total, totalPages },
    currentUserEntry,
    message: "Successfully fetched leaderboard results.",
  };
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
  if (!user) throw new Error("User does not exist.");

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
  const topCacheKey = `leaderboard:v2:${mode}:${mode_value}:top`;
  const countCacheKey = `leaderboard:v2:${mode}:${mode_value}:count`;
  try {
    await redis.del(topCacheKey);
    await redis.del(countCacheKey);
  } catch (err) {
    console.error("Cache invalidation failed: ", err);
  }
  return result;
}

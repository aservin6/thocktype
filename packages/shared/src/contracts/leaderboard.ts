import type { LeaderboardEntry } from "../types/result.ts";
import type { Mode } from "../mode.ts";
import { parseLimit, parsePage } from "../pagination.ts";
import { parseMode, parseModeValue } from "../mode.ts";

export type LeaderboardQuery = {
  mode: Mode;
  modeValue: number;
  page: number;
  limit: number;
};

export type LeaderboardQueryInput = {
  mode?: unknown;
  mode_value?: unknown;
  page?: unknown;
  limit?: unknown;
};

export function parseLeaderboardQuery(
  query: LeaderboardQueryInput,
): LeaderboardQuery {
  const mode = parseMode(query.mode);
  const modeValue = parseInt(parseModeValue(query.mode_value, mode), 10);
  const page = parsePage(query.page);
  const limit = parseLimit(query.limit);

  return { mode, modeValue, page, limit };
}

export type LeaderboardResponse = {
  data: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentUserEntry: LeaderboardEntry | null;
  message: string;
};

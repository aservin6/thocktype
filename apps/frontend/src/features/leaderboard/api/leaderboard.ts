import type { LeaderboardQuery, LeaderboardResponse } from "@thockr/shared";
import { apiClient } from "../../../shared/api/client";

export async function getLeaderboardResults({
  mode,
  modeValue,
  page,
  limit,
}: LeaderboardQuery): Promise<LeaderboardResponse> {
  const params = new URLSearchParams({
    mode,
    mode_value: modeValue.toString(),
    page: page.toString(),
    limit: limit.toString(),
  });

  const res = await apiClient(`/api/v1/leaderboard?${params.toString()}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: LeaderboardResponse = await res.json();
  return body;
}

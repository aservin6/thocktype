import { type LeaderboardResponse } from "@thockr/shared";
import { apiClient } from "../../../shared/api/client";

export async function getLeaderboardResults(
  mode: string,
  mode_value: string,
): Promise<LeaderboardResponse> {
  const res = await apiClient(
    `/api/v1/leaderboard?mode=${mode}&mode_value=${mode_value}`,
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  return await res.json();
}

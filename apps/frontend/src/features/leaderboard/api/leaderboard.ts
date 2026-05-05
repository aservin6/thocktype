import { type Result } from "@typing-test/shared";
import { apiClient } from "../../../shared/api/client";

export async function getLeaderboardResults(mode: string): Promise<Result[]> {
  const res = await apiClient(`/api/v1/leaderboard/${mode}`);
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

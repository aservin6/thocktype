import type {
  ApiErrorResponse,
  CreateResultRequest,
  CreateResultResponse,
  GetMeResultsResponse,
  GetMeStatsResponse,
  Result,
  UserStats,
} from "@thocktype/shared";
import { apiClient } from "../../../shared/api/client";

export async function postResult(
  resultPayload: CreateResultRequest,
): Promise<Result> {
  const res = await apiClient("/api/v1/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultPayload),
  });
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: CreateResultResponse = await res.json();
  return body.data;
}

export async function getMeResults(): Promise<Result[]> {
  const res = await apiClient("/api/v1/me/results");
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: GetMeResultsResponse = await res.json();
  return body.data;
}

export async function getMeStats(): Promise<UserStats> {
  const res = await apiClient("/api/v1/me/stats");
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: GetMeStatsResponse = await res.json();
  return body.data;
}

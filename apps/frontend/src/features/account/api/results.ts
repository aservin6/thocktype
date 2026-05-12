import type { Result, UserStats } from "@typing-test/shared";
import type { CreateResultPayload } from "@/features/typing/types/types";
import { apiClient } from "../../../shared/api/client";

export async function postResult(
  resultPayload: CreateResultPayload,
): Promise<Result> {
  const res = await apiClient("/api/v1/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(resultPayload),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

export async function getMeResults(): Promise<Result[]> {
  const res = await apiClient("/api/v1/me/results");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

export async function getMeStats(): Promise<UserStats> {
  const res = await apiClient("/api/v1/me/stats");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

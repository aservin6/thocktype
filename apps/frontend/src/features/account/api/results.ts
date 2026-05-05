import { type Result } from "@typing-test/shared";
import { apiClient } from "../../../shared/api/client";
import type { CreateResultPayload } from "@/features/typing/types/types";

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

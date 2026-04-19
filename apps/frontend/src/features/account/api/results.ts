import { type Result } from "@typing-test/shared";
import { apiClient } from "../../../shared/api/client";

export async function postResult(result: Result): Promise<Result> {
  const res = await apiClient("/api/results", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(result),
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

export async function getMeResults(): Promise<Result[]> {
  const res = await apiClient("/me/results");
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

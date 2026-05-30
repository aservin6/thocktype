import { apiClient } from "@/shared/api/client";
import type {
  ApiErrorResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from "@thocktype/shared";

export async function resetPassword({
  token,
  input,
}: {
  token: string | null;
  input: ResetPasswordRequest;
}): Promise<ResetPasswordResponse> {
  if (!token) throw new Error("Invalid token");
  const res = await apiClient(
    `/api/v1/auth/reset-password?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
    { skipRefresh: true },
  );

  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: ResetPasswordResponse = await res.json();
  return body;
}

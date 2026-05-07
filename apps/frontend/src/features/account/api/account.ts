import { apiClient } from "@/shared/api/client";

export async function changePassword(
  token: string | null,
  password: string,
  confirmPassword: string,
) {
  if (!token) throw new Error("Invalid token");
  const res = await apiClient(`/api/v1/auth/reset-password?token=${token}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password, confirmPassword }),
  });

  if (!res.ok) {
    const error = await res.json();

    throw new Error(error.message || "Unknown error");
  }
}

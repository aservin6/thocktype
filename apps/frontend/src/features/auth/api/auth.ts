import {
  type ApiErrorResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type PublicUser,
  type RegisterRequest,
  type RegisterResponse,
  type SignInRequest,
  type SignInResponse,
  type SignOutResponse,
  type VerifyResetTokenResponse,
} from "@typing-test/shared";
import { apiClient } from "../../../shared/api/client";

export async function signIn(input: SignInRequest): Promise<PublicUser> {
  const res = await apiClient(
    "/api/v1/auth/signin",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    { skipRefresh: true },
  );
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: SignInResponse = await res.json();
  return body.data;
}

export async function register(input: RegisterRequest): Promise<PublicUser> {
  const res = await apiClient(
    "/api/v1/auth/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    },
    { skipRefresh: true },
  );
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: RegisterResponse = await res.json();
  return body.data;
}

export async function signOut(): Promise<SignOutResponse> {
  const res = await apiClient(
    "/api/v1/auth/signout",
    {
      method: "POST",
    },
    { skipRefresh: true },
  );
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: SignOutResponse = await res.json();
  return body;
}

export async function getMe(): Promise<PublicUser> {
  const res = await apiClient("/api/v1/me", {
    method: "GET",
  });
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body = await res.json();
  return body.data;
}

export async function forgotPassword(
  input: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const res = await apiClient(
    "/api/v1/auth/forgot-password",
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
  const body: ForgotPasswordResponse = await res.json();
  return body;
}

export async function verifyResetToken(
  tokenParam: string | null,
): Promise<VerifyResetTokenResponse> {
  if (!tokenParam) throw new Error("Invalid token param.");

  const res = await apiClient(
    `/api/v1/auth/verify-reset-token?token=${tokenParam}`,
    { method: "GET" },
    { skipRefresh: true },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: VerifyResetTokenResponse = await res.json();
  return body;
}

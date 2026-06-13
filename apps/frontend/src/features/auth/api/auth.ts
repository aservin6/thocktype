import {
  type ApiErrorResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type GetMeResponse,
  type PublicUser,
  type RegisterRequest,
  type SignInRequest,
  type SignOutResponse,
  type VerifyResetTokenResponse,
} from "@thocktype/shared";
import { apiClient } from "../../../shared/api/client";
import { authClient } from "../lib/auth-client";

interface BetterAuthClientError {
  message?: string;
}

function getAuthErrorMessage(error: BetterAuthClientError | null | undefined) {
  return error?.message || "Authentication failed.";
}

function deriveUsername(email: string) {
  return email.toLowerCase().split("@")[0];
}

export async function signIn(input: SignInRequest): Promise<PublicUser> {
  const { error } = await authClient.signIn.email({
    email: input.email.toLowerCase(),
    password: input.password,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  return getMe();
}

export async function register(input: RegisterRequest): Promise<PublicUser> {
  const username = deriveUsername(input.email);
  const { error } = await authClient.signUp.email({
    email: input.email.toLowerCase(),
    password: input.password,
    name: username,
    username,
    displayUsername: username,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  return getMe();
}

export async function signOut(): Promise<SignOutResponse> {
  const { error } = await authClient.signOut();
  if (error) throw new Error(getAuthErrorMessage(error));
  return { message: "Signed out successfully." };
}

export async function getMe(): Promise<PublicUser> {
  const res = await apiClient("/api/v1/me", {
    method: "GET",
  });
  if (!res.ok) {
    const error: ApiErrorResponse = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: GetMeResponse = await res.json();
  return body.data;
}

export async function forgotPassword(
  input: ForgotPasswordRequest,
): Promise<ForgotPasswordResponse> {
  const res = await apiClient("/api/v1/auth/forgot-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
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
    {
      method: "GET",
    },
  );
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Unknown error");
  }
  const body: VerifyResetTokenResponse = await res.json();
  return body;
}

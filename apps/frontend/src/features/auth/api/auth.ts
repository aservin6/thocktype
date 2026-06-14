import {
  deriveUsernameFromEmail,
  type ApiErrorResponse,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type GetMeResponse,
  type PublicUser,
  type RegisterRequest,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type SignInRequest,
  type SignOutResponse,
} from "@thocktype/shared";
import { apiClient } from "../../../shared/api/client";
import { authClient } from "../lib/auth-client";

interface BetterAuthClientError {
  message?: string;
}

function getAuthErrorMessage(error: BetterAuthClientError | null | undefined) {
  return error?.message || "Authentication failed.";
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
  const username = deriveUsernameFromEmail(input.email);
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
  const { error } = await authClient.requestPasswordReset({
    email: input.email.toLowerCase(),
    redirectTo: `${window.location.origin}/reset-password`,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  return { message: "Password reset email sent." };
}

export async function resetPassword({
  token,
  input,
}: {
  token: string | null;
  input: ResetPasswordRequest;
}): Promise<ResetPasswordResponse> {
  if (!token) throw new Error("Invalid token");

  const { error } = await authClient.resetPassword({
    newPassword: input.password,
    token,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
  return { message: "Password reset successfully." };
}

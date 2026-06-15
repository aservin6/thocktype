import {
  deriveUsernameFromEmail,
  type ForgotPasswordRequest,
  type ForgotPasswordResponse,
  type RegisterRequest,
  type ResetPasswordRequest,
  type ResetPasswordResponse,
  type SignInRequest,
  type SignOutResponse,
} from "@thocktype/shared";
import { authClient } from "../lib/auth-client";

interface BetterAuthClientError {
  code?: string;
  message?: string;
}

function getAuthErrorMessage(error: BetterAuthClientError | null | undefined) {
  return error?.message || "Authentication failed.";
}

export async function signIn(input: SignInRequest): Promise<void> {
  const { error } = await authClient.signIn.email({
    email: input.email.toLowerCase(),
    password: input.password,
  });

  if (error) throw new Error(getAuthErrorMessage(error));
}

export async function register(input: RegisterRequest): Promise<void> {
  const email = input.email.toLowerCase();
  const { error } = await authClient.signUp.email({
    email,
    password: input.password,
    // Better Auth requires `name` on sign-up. The backend replaces this
    // placeholder with the final unique username before the user is inserted.
    name: deriveUsernameFromEmail(email),
  });

  if (error) throw new Error(getAuthErrorMessage(error));
}

export async function signOut(): Promise<SignOutResponse> {
  const { error } = await authClient.signOut();
  if (error) throw new Error(getAuthErrorMessage(error));
  return { message: "Signed out successfully." };
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

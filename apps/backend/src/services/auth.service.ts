import bcrypt from "bcrypt";
import {
  selectUserByEmail,
  insertUser,
  updateUserPassword,
} from "../repositories/user.repository.ts";
import type { PublicUser } from "@typing-test/shared";
import generateAccessToken from "../utils/generate-access-token.ts";
import {
  insertRefreshToken,
  deleteRefreshToken,
  selectRefreshToken,
} from "../repositories/refresh-token.repository.ts";
import generateRefreshToken from "../utils/generate-refresh-token.ts";
import generatePasswordResetToken from "../utils/generate-password-reset-token.ts";
import {
  deletePasswordResetToken,
  insertPasswordResetToken,
} from "../repositories/password-reset-token.repository.ts";

export async function register(
  email: string,
  password: string,
): Promise<PublicUser & { accessToken: string; refreshToken: string }> {
  email = email.toLowerCase();
  const user = await selectUserByEmail(email.toLowerCase());
  if (user) throw new Error("User already exists");

  // Username is derived from the email prefix for now.
  const username = email.toLowerCase().split("@")[0];
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await insertUser({ email, username, password_hash: hashedPassword });

  const accessToken = generateAccessToken(newUser.id);
  const { token, expiresAt } = generateRefreshToken();
  await insertRefreshToken(newUser.id, token, expiresAt);

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    email_verified: newUser.email_verified,
    created_at: newUser.created_at.toISOString(),
    accessToken,
    refreshToken: token,
  };
}

export async function signIn(
  email: string,
  password: string,
): Promise<PublicUser & { accessToken: string; refreshToken: string }> {
  email = email.toLowerCase();
  const user = await selectUserByEmail(email);
  // Same error for both missing user and wrong password to prevent email enumeration.
  if (!user) throw new Error("Confirm sign in details and try again");
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error("Confirm sign in details and try again");

  const accessToken = generateAccessToken(user.id);
  const { token, expiresAt } = generateRefreshToken();
  await insertRefreshToken(user.id, token, expiresAt);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    email_verified: user.email_verified,
    created_at: user.created_at.toISOString(),
    accessToken,
    refreshToken: token,
  };
}

// Token rotation: the incoming refresh token is deleted and a new pair is issued.
// This limits the window for stolen token reuse.
export async function refreshAuthTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  const storedToken = await selectRefreshToken(refreshToken);
  if (!storedToken) throw new Error("Refresh token not found");

  if (new Date() > new Date(storedToken.expires_at)) {
    await deleteRefreshToken(refreshToken);
    throw new Error("Refresh token has expired");
  }

  await deleteRefreshToken(refreshToken);
  const { token, expiresAt } = generateRefreshToken();
  const { user_id } = storedToken;

  await insertRefreshToken(user_id, token, expiresAt);
  const accessToken = generateAccessToken(user_id);

  return { accessToken, refreshToken: token };
}

// Returns silently with an empty token when the email is not found.
// The controller still sends the reset email response, preventing email enumeration.
export async function createPasswordResetToken(
  email: string,
): Promise<{ token: string }> {
  email = email.toLowerCase();
  const user = await selectUserByEmail(email);
  if (!user) return { token: "" };

  const { token, hashedToken, expiresAt } = generatePasswordResetToken();
  await insertPasswordResetToken(user.id, hashedToken, expiresAt);

  return { token };
}

// Deletes the reset token after use so it cannot be reused.
export async function updatePassword(
  userId: string,
  password: string,
  tokenId: string,
): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);
  await updateUserPassword(userId, hashedPassword);
  await deletePasswordResetToken(tokenId);
}

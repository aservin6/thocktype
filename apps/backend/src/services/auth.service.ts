import bcrypt from "bcrypt";
import crypto from "crypto";
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
import generatePasswordResetToken from "../utils/generate-reset-token.ts";
import {
  deletePasswordResetToken,
  insertPasswordResetToken,
  selectPasswordResetToken,
} from "../repositories/password_reset_token.repository.ts";

export async function register(
  email: string,
  password: string,
): Promise<PublicUser & { accessToken: string; refreshToken: string }> {
  email = email.toLowerCase();
  // Throw error if user with email exists already
  const user = await selectUserByEmail(email.toLowerCase());
  if (user) throw new Error("User already exists");
  // Generate username
  const username = email.toLowerCase().split("@")[0];
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create user with given details
  const newUser = await insertUser({
    email,
    username,
    password_hash: hashedPassword,
  });
  // Generate tokens
  const accessToken = generateAccessToken(newUser.id);
  const { token, expiresAt } = generateRefreshToken();
  await insertRefreshToken(newUser.id, token, expiresAt);

  return {
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    email_verified: newUser.email_verified,
    created_at: newUser.created_at,
    accessToken,
    refreshToken: token,
  };
}

export async function signIn(
  email: string,
  password: string,
): Promise<PublicUser & { accessToken: string; refreshToken: string }> {
  email = email.toLowerCase();
  // Throw error if user doesn't exist
  const user = await selectUserByEmail(email);
  if (!user) throw new Error("Confirm sign in details and try again");
  // Throw error if password is not correct
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error("Confirm sign in details and try again");
  // Generate tokens and return user
  const accessToken = generateAccessToken(user.id);
  const { token, expiresAt } = generateRefreshToken();
  await insertRefreshToken(user.id, token, expiresAt);

  return {
    id: user.id,
    username: user.username,
    email: user.email,
    email_verified: user.email_verified,
    created_at: user.created_at,
    accessToken,
    refreshToken: token,
  };
}

export async function refresh(
  refreshTokenString: string,
): Promise<{ accessToken: string; refreshToken: string }> {
  // Find existing refresh token
  const dbToken = await selectRefreshToken(refreshTokenString);
  // If it does not exist throw Error
  if (!dbToken) throw new Error("Refresh token not found");
  // If it is expired, delete it then throw Error
  if (new Date() > new Date(dbToken.expires_at)) {
    await deleteRefreshToken(refreshTokenString);
    throw new Error("Refresh token has expired");
  }
  // Delete non expired refresh token
  // then generate both a new access and refresh token
  await deleteRefreshToken(refreshTokenString);
  const { token } = generateRefreshToken();
  const { user_id, expires_at } = dbToken;

  await insertRefreshToken(user_id, token, expires_at);
  const accessToken = generateAccessToken(user_id);

  return { accessToken, refreshToken: token };
}

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

export async function resetPassword(
  token: string,
  password: string,
): Promise<void> {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const resetToken = await selectPasswordResetToken(hashedToken);
  if (!resetToken) throw new Error("Invalid token");
  if (new Date() > new Date(resetToken.expires_at))
    throw new Error("Invalid token");

  const hashedPassword = await bcrypt.hash(password, 10);

  await updateUserPassword(resetToken.user_id, hashedPassword);

  await deletePasswordResetToken(resetToken.id);
}

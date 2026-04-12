import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createUser,
} from "../repositories/user.repository.ts";
import type { PublicUser } from "@typing-test/shared";
import generateAccessToken from "../utils/generate-access-token.ts";
import {
  createRefreshToken,
  deleteRefreshToken,
  findRefreshToken,
} from "../repositories/refresh-token.repository.ts";
import generateRefreshToken from "../utils/generate-refresh-token.ts";

export async function register(
  email: string,
  password: string,
): Promise<PublicUser & { accessToken: string; refreshToken: string }> {
  // Throw error if user with email exists already
  const user = await findUserByEmail(email);
  if (user) throw new Error("User already exists");
  // Generate username
  const username = email.split("@")[0];
  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);
  // Create user with given details
  const newUser = await createUser({
    email,
    username,
    password_hash: hashedPassword,
  });
  // Generate tokens
  const accessToken = generateAccessToken(newUser.id);
  const { token, expiresAt } = generateRefreshToken();
  await createRefreshToken(newUser.id, token, expiresAt);

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
  // Throw error if user doesn't exist
  const user = await findUserByEmail(email);
  if (!user) throw new Error("Confirm sign in details and try again");
  // Throw error if password is not correct
  const isValid = await bcrypt.compare(password, user.password_hash);
  if (!isValid) throw new Error("Confirm sign in details and try again");
  // Generate tokens and return user
  const accessToken = generateAccessToken(user.id);
  const { token, expiresAt } = generateRefreshToken();
  await createRefreshToken(user.id, token, expiresAt);

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
  const dbToken = await findRefreshToken(refreshTokenString);
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

  await createRefreshToken(user_id, token, expires_at);
  const accessToken = generateAccessToken(user_id);

  return { accessToken, refreshToken: token };
}

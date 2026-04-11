import bcrypt from "bcrypt";
import {
  findUserByEmail,
  createUser,
} from "../repositories/user.repository.ts";
import type { PublicUser } from "@typing-test/shared";
import generateToken from "../utils/generate-token.ts";
import { createRefreshToken } from "../repositories/refresh-token.repository.ts";
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
  const accessToken = generateToken(newUser.id);
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

  // Generate token and return user
  const accessToken = generateToken(user.id);
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

export async function refresh() {}

import { randomBytes } from "node:crypto";
import type { UsernameOptions } from "better-auth/plugins";
import pool from "../db/pool.ts";
import type { UserCreateBeforeHook } from "./types.ts";

const AUTH_USERNAME_MIN_LENGTH = 3;
const AUTH_USERNAME_MAX_LENGTH = 30;
const USERNAME_CREATION_ATTEMPTS = 5;
const USERNAME_PREFIX = "user_";
const USERNAME_RANDOM_BYTES = 8;

export const usernamePluginOptions = {
  minUsernameLength: AUTH_USERNAME_MIN_LENGTH,
  maxUsernameLength: AUTH_USERNAME_MAX_LENGTH,
} satisfies UsernameOptions;

function createUsernameCandidate() {
  return `${USERNAME_PREFIX}${randomBytes(USERNAME_RANDOM_BYTES).toString("hex")}`;
}

async function usernameExists(username: string) {
  const result = await pool.query('SELECT 1 FROM "user" WHERE username = $1', [
    username,
  ]);

  return result.rows.length > 0;
}

async function createUniqueUsername() {
  for (let attempt = 0; attempt < USERNAME_CREATION_ATTEMPTS; attempt += 1) {
    const username = createUsernameCandidate();

    if (!(await usernameExists(username))) return username;
  }

  throw new Error("Could not create a unique username.");
}

export const allocateUsernameBeforeCreate = (async (user) => {
  const username = await createUniqueUsername();

  return {
    data: {
      ...user,
      name: username,
      username,
      displayUsername: username,
    },
  };
}) satisfies UserCreateBeforeHook;

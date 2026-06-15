import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth";
import { username } from "better-auth/plugins";
import pool from "../db/pool.ts";
import requireEnv from "../utils/require-env.ts";
import { sendPasswordResetEmail } from "./email.ts";
import {
  allocateUsernameBeforeCreate,
  usernamePluginOptions,
} from "./username.ts";

const frontendOrigin = requireEnv("FRONTEND_ORIGIN");

const disabledAuthPaths = [
  // Username allocation is server-side; do not expose username enumeration.
  "/is-username-available",
  // Current UX only supports email/password sign-in.
  "/sign-in/username",
];

const authOptions: BetterAuthOptions = {
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  database: pool,
  trustedOrigins: [frontendOrigin],
  disabledPaths: disabledAuthPaths,
  databaseHooks: {
    user: {
      create: {
        before: allocateUsernameBeforeCreate,
      },
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: sendPasswordResetEmail,
  },
  plugins: [username(usernamePluginOptions)],
};

export const auth: Auth = betterAuth(authOptions);

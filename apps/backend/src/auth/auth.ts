import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth";
import { username } from "better-auth/plugins";
import pool from "../db/pool.ts";
import requireEnv from "../utils/require-env.ts";

const frontendOrigin = requireEnv("FRONTEND_ORIGIN");

const authOptions: BetterAuthOptions = {
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  database: pool,
  trustedOrigins: [frontendOrigin],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [username()],
};

export const auth: Auth = betterAuth(authOptions);

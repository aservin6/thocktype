import { betterAuth } from "better-auth";
import pool from "../db/pool.ts";
import requireEnv from "../utils/require-env.ts";

const frontendOrigin = requireEnv("FRONTEND_ORIGIN");

export const auth = betterAuth({
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  database: pool,
  trustedOrigins: [frontendOrigin],
  emailAndPassword: {
    enabled: true,
  },
});

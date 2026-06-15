import {
  AUTH_USERNAME_MAX_LENGTH,
  AUTH_USERNAME_MIN_LENGTH,
} from "@thocktype/shared";
import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth";
import { username } from "better-auth/plugins";
import { Resend } from "resend";
import pool from "../db/pool.ts";
import requireEnv from "../utils/require-env.ts";

const frontendOrigin = requireEnv("FRONTEND_ORIGIN");
const resend = new Resend(requireEnv("RESEND_API_KEY"));

const authOptions: BetterAuthOptions = {
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  database: pool,
  trustedOrigins: [frontendOrigin],
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await resend.emails.send({
        from: "onboarding@resend.dev",
        to: user.email,
        subject: "Reset your password",
        html: `<p>Click <a href="${url}">here</a> to reset your password.</p>`,
      });
    },
  },
  plugins: [
    username({
      minUsernameLength: AUTH_USERNAME_MIN_LENGTH,
      maxUsernameLength: AUTH_USERNAME_MAX_LENGTH,
    }),
  ],
};

export const auth: Auth = betterAuth(authOptions);

import {
  AUTH_USERNAME_AVAILABILITY_ATTEMPTS,
  AUTH_USERNAME_MAX_LENGTH,
  AUTH_USERNAME_MIN_LENGTH,
  createAuthUsernameCandidate,
  deriveUsernameFromEmail,
} from "@thocktype/shared";
import { betterAuth, type Auth, type BetterAuthOptions } from "better-auth";
import { username } from "better-auth/plugins";
import { Resend } from "resend";
import pool from "../db/pool.ts";
import requireEnv from "../utils/require-env.ts";

const frontendOrigin = requireEnv("FRONTEND_ORIGIN");
const resend = new Resend(requireEnv("RESEND_API_KEY"));

// Keep username allocation server-side so registration doesn't need to expose
// username availability checks or retry logic to the browser.
async function createUniqueUsernameForEmail(email: string) {
  const usernameBase = deriveUsernameFromEmail(email);
  const candidates = Array.from(
    { length: AUTH_USERNAME_AVAILABILITY_ATTEMPTS },
    (_, attempt) => createAuthUsernameCandidate(usernameBase, attempt),
  );
  // Fetch all collisions in one query, then use the first untaken candidate
  // so common emails get stable names like "sam", "sam_2", "sam_3", etc.
  const result = await pool.query<{ username: string }>(
    'SELECT username FROM "user" WHERE username = ANY($1::text[])',
    [candidates],
  );
  const takenUsernames = new Set(result.rows.map((row) => row.username));
  const username = candidates.find(
    (candidate) => !takenUsernames.has(candidate),
  );

  if (!username) throw new Error("Could not find an available username.");
  return username;
}

const authOptions: BetterAuthOptions = {
  baseURL: requireEnv("BETTER_AUTH_URL"),
  secret: requireEnv("BETTER_AUTH_SECRET"),
  database: pool,
  trustedOrigins: [frontendOrigin],
  // Username sign-in is not part of the current UX, and public availability
  // checks can leak which usernames exist. Allocation happens in the hook below.
  disabledPaths: ["/is-username-available", "/sign-in/username"],
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          const username = await createUniqueUsernameForEmail(user.email);

          // Better Auth still receives a client-provided `name`, but the
          // canonical display fields are overwritten here before insert.
          return {
            data: {
              ...user,
              name: username,
              username,
              displayUsername: username,
            },
          };
        },
      },
    },
  },
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

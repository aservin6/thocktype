import { getPasswordPolicyErrors } from "@thocktype/shared";
import { APIError, createAuthMiddleware } from "better-auth/api";

const passwordAuthPaths = {
  "/sign-up/email": "password",
  "/reset-password": "newPassword",
} as const;

type PasswordAuthPath = keyof typeof passwordAuthPaths;

function isPasswordAuthPath(path: string): path is PasswordAuthPath {
  return path in passwordAuthPaths;
}

function readPasswordFromBody(
  body: unknown,
  passwordField: (typeof passwordAuthPaths)[PasswordAuthPath],
) {
  if (!body || typeof body !== "object") return null;
  const value = (body as Partial<Record<typeof passwordField, unknown>>)[
    passwordField
  ];

  return typeof value === "string" ? value : null;
}

export const validatePasswordBeforeAuthRequest = createAuthMiddleware(
  async (ctx) => {
    if (!isPasswordAuthPath(ctx.path)) return;

    const password = readPasswordFromBody(
      ctx.body,
      passwordAuthPaths[ctx.path],
    );
    const errors = password ? getPasswordPolicyErrors(password) : [];

    if (!password || errors.length > 0) {
      throw new APIError("BAD_REQUEST", {
        message: errors[0] ?? "Password is required.",
      });
    }
  },
);


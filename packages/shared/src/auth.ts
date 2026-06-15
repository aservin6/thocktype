import type { PublicUser } from "./types/user.ts";

export type AuthUserLike = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date | string;
  username?: string | null;
  displayUsername?: string | null;
};

export const AUTH_USERNAME_MIN_LENGTH = 3;
export const AUTH_USERNAME_MAX_LENGTH = 30;
export const AUTH_USERNAME_AVAILABILITY_ATTEMPTS = 100;

export function normalizeAuthUsernameBase(value: string) {
  const normalizedValue = value
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "_")
    .replace(/[_.]{2,}/g, "_")
    .replace(/^[_.]+|[_.]+$/g, "");

  return normalizedValue || "user";
}

export function createAuthUsernameCandidate(base: string, attempt: number) {
  const suffix = attempt === 0 ? "" : `_${attempt + 1}`;
  const maxBaseLength = AUTH_USERNAME_MAX_LENGTH - suffix.length;
  const normalizedBase = normalizeAuthUsernameBase(base);
  const paddedBase = normalizedBase.padEnd(AUTH_USERNAME_MIN_LENGTH, "0");

  return `${paddedBase.slice(0, maxBaseLength)}${suffix}`;
}

export function deriveUsernameFromEmail(email: string) {
  const normalizedEmail = email.toLowerCase();
  const localPart = normalizedEmail.split("@")[0] || normalizedEmail;
  return createAuthUsernameCandidate(localPart, 0);
}

export function getAuthDisplayUsername(
  user: Pick<AuthUserLike, "name"> &
    Partial<Pick<AuthUserLike, "displayUsername" | "username">>,
) {
  return user.displayUsername ?? user.username ?? user.name;
}

export function authUserToPublicUser(user: AuthUserLike): PublicUser {
  return {
    id: user.id,
    username: getAuthDisplayUsername(user),
    email: user.email,
    email_verified: user.emailVerified,
    created_at:
      user.createdAt instanceof Date
        ? user.createdAt.toISOString()
        : user.createdAt,
  };
}

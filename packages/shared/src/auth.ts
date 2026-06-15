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

// Keep these in shared so the frontend can show the same derived placeholder
// name that the backend later uses as the base for final username allocation.
export const AUTH_USERNAME_MIN_LENGTH = 3;
export const AUTH_USERNAME_MAX_LENGTH = 30;
export const AUTH_USERNAME_AVAILABILITY_ATTEMPTS = 100;

// Produces a Better Auth username-safe base from user-controlled text. The
// backend still owns uniqueness; this only normalizes the candidate shape.
export function normalizeAuthUsernameBase(value: string) {
  const normalizedValue = value
    .toLowerCase()
    .replace(/[^a-z0-9_.]/g, "_")
    .replace(/[_.]{2,}/g, "_")
    .replace(/^[_.]+|[_.]+$/g, "");

  return normalizedValue || "user";
}

// attempt 0 keeps the base unchanged; later attempts append a stable suffix
// while preserving the max length accepted by the Better Auth username plugin.
export function createAuthUsernameCandidate(base: string, attempt: number) {
  const suffix = attempt === 0 ? "" : `_${attempt + 1}`;
  const maxBaseLength = AUTH_USERNAME_MAX_LENGTH - suffix.length;
  const normalizedBase = normalizeAuthUsernameBase(base);
  const paddedBase = normalizedBase.padEnd(AUTH_USERNAME_MIN_LENGTH, "0");

  return `${paddedBase.slice(0, maxBaseLength)}${suffix}`;
}

// Uses only the email local-part as a human-friendly seed. The final username
// may differ if the backend detects a collision.
export function deriveUsernameFromEmail(email: string) {
  const normalizedEmail = email.toLowerCase();
  const localPart = normalizedEmail.split("@")[0] || normalizedEmail;
  return createAuthUsernameCandidate(localPart, 0);
}

// Prefer the explicit display username, then the normalized username, then
// Better Auth's required `name` field for older or partially populated users.
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

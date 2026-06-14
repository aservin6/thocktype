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

export function deriveUsernameFromEmail(email: string) {
  const normalizedEmail = email.toLowerCase();
  return normalizedEmail.split("@")[0] || normalizedEmail;
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

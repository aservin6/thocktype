import type { CookieOptions, Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const ACCESS_TOKEN_COOKIE = "access_token";
export const SESSION_TOKEN_COOKIE = "session_token";
export const LEGACY_SESSION_TOKEN_COOKIE = "refresh_token";

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  sessionToken: string,
) {
  res.cookie(ACCESS_TOKEN_COOKIE, accessToken, authCookieOptions);
  res.cookie(SESSION_TOKEN_COOKIE, sessionToken, authCookieOptions);
  res.clearCookie(LEGACY_SESSION_TOKEN_COOKIE);
}

export function clearAuthCookies(res: Response) {
  res.clearCookie(ACCESS_TOKEN_COOKIE);
  res.clearCookie(SESSION_TOKEN_COOKIE);
  res.clearCookie(LEGACY_SESSION_TOKEN_COOKIE);
}

import { CookieOptions, Response } from "express";

const isProduction = process.env.NODE_ENV === "production";

const authCookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict",
};

export function setAuthCookies(
  res: Response,
  accessToken: string,
  refreshToken: string,
) {
  res.cookie("access_token", accessToken, authCookieOptions);
  res.cookie("refresh_token", refreshToken, authCookieOptions);
}

export function clearAuthCookies(res: Response) {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
}

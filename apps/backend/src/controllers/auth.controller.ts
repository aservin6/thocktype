import type { NextFunction, Request, Response } from "express";
import { refresh, register, signIn } from "../services/auth.service.ts";
import { deleteRefreshToken } from "../repositories/refresh-token.repository.ts";

const isProduction = process.env.NODE_ENV === "production";

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body;
  // Pass user input into register flow
  try {
    const user = await register(email, password);
    const { accessToken, refreshToken, ...publicUser } = user;
    // Set auth cookies upon successful user registration
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.status(201).json({
      data: publicUser,
      message: "New user registered successfully",
    });
  } catch (err) {
    next(err);
  }
}

export async function signInUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body;
  // Pass user input into sign in flow
  try {
    const user = await signIn(email, password);
    const { accessToken, refreshToken, ...publicUser } = user;
    // Set auth cookies upon successful user sign in
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.status(200).json({
      data: publicUser,
      message: "User signed in successfully",
    });
  } catch (err) {
    next(err);
  }
}

export async function signOutUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Delete current refresh token from DB
  const refreshTokenString = req.cookies.refresh_token;
  if (!refreshTokenString) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json({ message: "Signed out successfully" });
    return;
  }
  try {
    await deleteRefreshToken(refreshTokenString);
    // then clear both local cookies (access + refresh)
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");

    res.status(200).json({ message: "Signed out successfully" });
  } catch (err) {
    next(err);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  res.status(200).json({ data: req.user });
}

export async function refreshTokens(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  // Grab local refresh token string
  const refreshTokenString = req.cookies.refresh_token;
  if (!refreshTokenString) {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(401).json({ message: "No token found. Unauthorized access" });
    return;
  }
  // Refresh tokens and set new cookies
  try {
    const { accessToken, refreshToken } = await refresh(refreshTokenString);
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.status(200).json({ message: "Tokens refreshed successfully" });
  } catch (err) {
    next(err);
  }
}

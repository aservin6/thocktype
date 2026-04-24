import type { NextFunction, Request, Response } from "express";
import {
  refresh,
  register,
  signIn,
  createPasswordResetToken,
  resetPassword as resetPasswordService,
} from "../services/auth.service.ts";
import { deleteRefreshToken } from "../repositories/refresh-token.repository.ts";
import { Resend } from "resend";
import requireEnv from "../utils/require-env.ts";

const isProduction = process.env.NODE_ENV === "production";
const resend = new Resend(requireEnv("RESEND_API_KEY"));

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

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email } = req.body;

  try {
    const { token } = await createPasswordResetToken(email);
    if (token) {
      await resend.emails.send({
        from: `onboarding@resend.dev`,
        to: email.toLowerCase(),
        subject: "Reset your password",
        html: `<p>Click <a href="http://localhost:3000/reset-password?token=${token}&email=${email.toLowerCase()}">here</a> to reset your password.</p>`,
      });
    }
    res.status(200).json({ message: "Password reset email sent" });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.query.token as string;
  const { password } = req.body;

  if (!token) {
    res.status(401).json({ message: "No token found. Unauthorized access" });
    return;
  }

  try {
    await resetPasswordService(token, password);
    res.status(200).json({ message: "Password reset successfully" });
  } catch (err) {
    next(err);
  }
}

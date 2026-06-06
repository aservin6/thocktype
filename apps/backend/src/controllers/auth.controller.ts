import type {
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  GetMeResponse,
  RefreshResponse,
  RegisterRequest,
  RegisterResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  SignInRequest,
  SignInResponse,
  SignOutResponse,
} from "@thocktype/shared";
import type { NextFunction, Request, Response } from "express";
import { Resend } from "resend";
import { deleteRefreshToken } from "../repositories/refresh-token.repository.ts";
import {
  createPasswordResetToken,
  refreshAuthTokens,
  register,
  signIn,
  updatePassword,
} from "../services/auth.service.ts";
import { clearAuthCookies, setAuthCookies } from "../utils/cookies.ts";
import requireEnv from "../utils/require-env.ts";
import { sendErrorResponse } from "../utils/send-error-response.ts";

const frontendOrigin = requireEnv("FRONTEND_ORIGIN");
const resend = new Resend(requireEnv("RESEND_API_KEY"));

export async function registerUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body as RegisterRequest;
  // Pass user input into register flow
  try {
    const user = await register(email, password);
    const { accessToken, refreshToken, ...publicUser } = user;
    const responseBody: RegisterResponse = {
      data: publicUser,
      message: "New user registered successfully.",
    };
    setAuthCookies(res, accessToken, refreshToken);
    res.status(201).json(responseBody);
  } catch (err) {
    next(err);
  }
}

export async function signInUser(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { email, password } = req.body as SignInRequest;
  // Pass user input into sign in flow
  try {
    const user = await signIn(email, password);
    const { accessToken, refreshToken, ...publicUser } = user;
    const responseBody: SignInResponse = {
      data: publicUser,
      message: "User signed in successfully.",
    };
    setAuthCookies(res, accessToken, refreshToken);
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
}

export async function signOutUser(req: Request, res: Response): Promise<void> {
  const responseBody: SignOutResponse = {
    message: "Signed out successfully.",
  };
  // Delete current refresh token from DB
  const refreshToken = req.cookies.refresh_token;
  if (refreshToken) {
    try {
      await deleteRefreshToken(refreshToken);
    } catch (err) {
      console.error(
        "Error occurred while trying to delete refresh token.",
        err,
      );
    }
  }
  clearAuthCookies(res);
  res.status(200).json(responseBody);
}

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) throw Error("Unauthorized request.");

  const responseBody: GetMeResponse = {
    data: user,
    message: "User found.",
  };
  res.status(200).json(responseBody);
}

export async function refreshTokens(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const responseBody: RefreshResponse = {
    message: "Tokens refreshed successfully.",
  };
  const refreshToken = req.cookies.refresh_token;
  if (!refreshToken) {
    clearAuthCookies(res);
    sendErrorResponse(res, 401, {
      message: "No token found. Unauthorized access.",
      code: "AUTH_REQUIRED",
    });
    return;
  }
  // Refresh tokens and set new cookies
  try {
    const { accessToken, refreshToken: newRefreshToken } =
      await refreshAuthTokens(refreshToken);
    setAuthCookies(res, accessToken, newRefreshToken);
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
}

// Always responds with 200 regardless of whether the email exists.
// This prevents leaking which emails are registered.
export async function forgotPassword(
  req: Request,
  res: Response,
): Promise<void> {
  const { email } = req.body as ForgotPasswordRequest;

  const responseBody: ForgotPasswordResponse = {
    message: "Password reset email sent.",
  };

  try {
    const { token } = await createPasswordResetToken(email);
    try {
      if (token) {
        await resend.emails.send({
          from: `onboarding@resend.dev`,
          to: email.toLowerCase(),
          subject: "Reset your password",
          html: `<p>Click <a href="${frontendOrigin}/reset-password?token=${token}&email=${encodeURIComponent(email.toLowerCase())}">here</a> to reset your password.</p>`,
        });
      }
    } catch (err) {
      console.error("Error sending password reset email.", err);
    }
  } catch (err) {
    console.error("Error creating password reset token.", err);
  }
  res.status(200).json(responseBody);
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { password } = req.body as ResetPasswordRequest;
  const { user_id, id } = req.passwordResetToken!;
  const responseBody: ResetPasswordResponse = {
    message: "Password reset successfully.",
  };
  try {
    await updatePassword(user_id, password, id);
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
}

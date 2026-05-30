import type { NextFunction, Request, Response } from "express";
import {
  refreshAuthTokens,
  register,
  signIn,
  createPasswordResetToken,
  updatePassword,
} from "../services/auth.service.ts";
import { deleteRefreshToken } from "../repositories/refresh-token.repository.ts";
import { Resend } from "resend";
import requireEnv from "../utils/require-env.ts";
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
import { sendErrorResponse } from "../utils/send-error-response.ts";

const isProduction = process.env.NODE_ENV === "production";
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
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
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
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
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
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
    res.cookie("refresh_token", newRefreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "strict",
    });
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
          html: `<p>Click <a href="http://localhost:5173/reset-password?token=${token}&email=${email.toLowerCase()}">here</a> to reset your password.</p>`,
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

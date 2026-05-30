import { z } from "zod";
import type { PublicUser } from "../types/user.ts";
import type { ApiSuccessResponse, ApiMessageResponse } from "./api.ts";

const passwordSchema = z
  .string()
  .min(8, "Password is too short. Must be at least 8 characters long.")
  .max(72, "Password is too long.")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
  .regex(/[0-9]/, "Password must contain at least one number.")
  .regex(
    /[!@#$%^&*]/,
    "Password must contain at least one allowed special character.",
  );

export const registerRequestSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .max(254, "Email is too long."),
  password: passwordSchema,
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

// POST /api/v1/auth/register also sets httpOnly access_token and refresh_token cookies.
// The tokens are intentionally excluded from the JSON response contract.
export type RegisterResponse = ApiSuccessResponse<PublicUser>;

export const signInRequestSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

// POST /api/v1/auth/signin also sets httpOnly access_token and refresh_token cookies.
export type SignInResponse = ApiSuccessResponse<PublicUser>;

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

// POST /api/v1/auth/forgot-password always returns success message
// even if the email is not registered.
export type ForgotPasswordResponse = ApiMessageResponse;

// POST /api/v1/auth/signout clears httpOnly access_token and refresh_token cookies.
export type SignOutResponse = ApiMessageResponse;

// POST /api/v1/auth/refresh rotates httpOnly access_token and refresh_token cookies.
export type RefreshResponse = ApiMessageResponse;

export const resetPasswordRequestSchema = z
  .object({
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

export type ResetPasswordRequest = z.infer<typeof resetPasswordRequestSchema>;

// POST /api/v1/auth/reset-password requires a valid reset token query param.
export type ResetPasswordResponse = ApiMessageResponse;

// GET /api/v1/auth/verify-reset-token requires a reset token query param.
export type VerifyResetTokenResponse = ApiMessageResponse;

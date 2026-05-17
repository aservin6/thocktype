import type { PublicUser } from "../types/user.ts";
import { z } from "zod";

export type ApiSuccessResponse<TData> = {
  data: TData;
  message: string;
};

export type ApiMessageResponse = {
  message: string;
};

export type ApiErrorResponse = {
  message: string;
};

export const registerRequestSchema = z.object({
  email: z
    .string()
    .email("Enter a valid email address.")
    .max(254, "Email is too long."),
  password: z
    .string()
    .min(8, "Password is too short. Must be at least 8 characters long.")
    .max(72, "Password is too long.")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter.")
    .regex(/[0-9]/, "Password must contain at least one number.")
    .regex(
      /[!@#$%^&*]/,
      "Password must contain at least one allowed special character.",
    ),
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

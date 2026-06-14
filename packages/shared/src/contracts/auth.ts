import { z } from "zod";
import type { ApiMessageResponse } from "./api.ts";

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

export const signInRequestSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password."),
});

export type SignInRequest = z.infer<typeof signInRequestSchema>;

export const forgotPasswordRequestSchema = z.object({
  email: z.string().email("Enter a valid email address."),
});

export type ForgotPasswordRequest = z.infer<typeof forgotPasswordRequestSchema>;

// Password reset is handled by Better Auth. This response type keeps UI wrappers
// independent from Better Auth's raw client response shape.
export type ForgotPasswordResponse = ApiMessageResponse;

export type SignOutResponse = ApiMessageResponse;

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

// Password reset is handled by Better Auth. This response type keeps UI wrappers
// independent from Better Auth's raw client response shape.
export type ResetPasswordResponse = ApiMessageResponse;

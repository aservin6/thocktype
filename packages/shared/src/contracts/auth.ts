import { z } from "zod";
import type { ApiMessageResponse } from "./api.ts";

export const PASSWORD_MIN_LENGTH = 8;
export const PASSWORD_MAX_LENGTH = 72;

const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_NUMBER_REGEX = /[0-9]/;
const PASSWORD_ALLOWED_SPECIAL_CHARACTER_REGEX = /[!@#$%^&*]/;

export function getPasswordPolicyErrors(password: string) {
  const errors: string[] = [];

  if (password.length < PASSWORD_MIN_LENGTH) {
    errors.push(
      "Password is too short. Must be at least 8 characters long.",
    );
  }
  if (password.length > PASSWORD_MAX_LENGTH) {
    errors.push("Password is too long.");
  }
  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    errors.push("Password must contain at least one uppercase letter.");
  }
  if (!PASSWORD_NUMBER_REGEX.test(password)) {
    errors.push("Password must contain at least one number.");
  }
  if (!PASSWORD_ALLOWED_SPECIAL_CHARACTER_REGEX.test(password)) {
    errors.push(
      "Password must contain at least one allowed special character.",
    );
  }

  return errors;
}

const passwordSchema = z.string().superRefine((password, ctx) => {
  getPasswordPolicyErrors(password).forEach((message) => {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message,
    });
  });
});

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

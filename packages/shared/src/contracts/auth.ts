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
  email: z.string().email().max(254),
  password: z
    .string()
    .min(8)
    .max(72)
    .regex(/^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*]).*$/),
});

export type RegisterRequest = z.infer<typeof registerRequestSchema>;

export type RegisterResponse = ApiSuccessResponse<PublicUser>;

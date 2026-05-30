import z from "zod";
import type { Result } from "../types/result.ts";
import type { ApiSuccessResponse } from "./api.ts";
import { MODE_VALUES_BY_MODE, MODES } from "../mode.ts";

export const createResultRequestSchema = z
  .object({
    wpm: z
      .number({
        required_error: "WPM is required.",
        invalid_type_error: "WPM must be a number.",
      })
      .min(0, "WPM cannot be negative.")
      .max(400, "WPM is unrealistically high."),

    timeElapsed: z
      .number({
        required_error: "Time elapsed is required.",
        invalid_type_error: "Time elapsed must be a number.",
      })
      .gt(0, "Time elapsed must be greater than zero."),

    accuracy: z
      .number({
        required_error: "Accuracy is required.",
        invalid_type_error: "Accuracy must be a number.",
      })
      .min(0, "Accuracy cannot be negative.")
      .max(100, "Accuracy cannot be greater than 100."),

    mode: z.enum(MODES, {
      required_error: "Mode is required.",
      invalid_type_error: "Mode must be a valid typing mode.",
    }),

    modeValue: z.number({
      required_error: "Mode value is required.",
      invalid_type_error: "Mode value must be a number.",
    }),

    correct: z
      .number({
        required_error: "Correct character count is required.",
        invalid_type_error: "Correct character count must be a number.",
      })
      .int("Correct character count must be an integer.")
      .min(0, "Correct character count cannot be negative."),

    incorrect: z
      .number({
        required_error: "Incorrect character count is required.",
        invalid_type_error: "Incorrect character count must be a number.",
      })
      .int("Incorrect character count must be an integer.")
      .min(0, "Incorrect character count cannot be negative."),
  })
  .refine(
    (data) =>
      MODE_VALUES_BY_MODE[data.mode].includes(data.modeValue.toString()),
    {
      path: ["modeValue"],
      message: "Mode value is not valid for the selected mode.",
    },
  )
  .refine((data) => data.correct + data.incorrect > 0, {
    path: ["correct"],
    message: "Result must include at least one typed character.",
  });

export type CreateResultRequest = z.infer<typeof createResultRequestSchema>;

export type CreateResultResponse = ApiSuccessResponse<Result>;

import { createResultRequestSchema } from "@thockr/shared";
import { validateBody } from "./validate-body.ts";
import type { RequestHandler } from "express";

export const validateResultInput: RequestHandler = validateBody(
  createResultRequestSchema,
  "Invalid result input.",
);

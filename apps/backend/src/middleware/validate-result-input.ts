import { createResultRequestSchema } from "@thocktype/shared";
import type { RequestHandler } from "express";
import { validateBody } from "./validate-body.ts";

export const validateResultInput: RequestHandler = validateBody(
  createResultRequestSchema,
  "Invalid result input.",
);

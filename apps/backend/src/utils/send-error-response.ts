import type { ApiErrorResponse } from "@thockr/shared";
import type { Response } from "express";

export function sendErrorResponse(
  res: Response,
  status: number,
  error: ApiErrorResponse,
): void {
  res.status(status).json(error);
}

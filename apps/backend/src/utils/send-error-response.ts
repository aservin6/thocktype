import type { ApiErrorResponse } from "@thocktype/shared";
import type { Response } from "express";

export function sendErrorResponse(
  res: Response,
  status: number,
  error: ApiErrorResponse,
): void {
  res.status(status).json(error);
}

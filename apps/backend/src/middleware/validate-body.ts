import type { Request, Response, NextFunction, RequestHandler } from "express";
import type { ZodTypeAny } from "zod";
import { sendErrorResponse } from "../utils/send-error-response.ts";

export function validateBody(
  schema: ZodTypeAny,
  fallbackMessage: string,
): RequestHandler {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      const fieldErrors: Record<string, string[]> = {};

      for (const issue of result.error.issues) {
        const key = issue.path.length > 0 ? issue.path.join(".") : "_form";

        fieldErrors[key] ??= [];
        fieldErrors[key].push(issue.message);
      }

      sendErrorResponse(res, 400, {
        message: fallbackMessage,
        code: "VALIDATION_ERROR",
        fieldErrors,
      });
      return;
    }
    req.body = result.data;
    next();
  };
}

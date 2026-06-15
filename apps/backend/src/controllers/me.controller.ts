import type { GetMeResponse } from "@thocktype/shared";
import type { Request, Response } from "express";
import { requireUser } from "../auth/session.ts";

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = requireUser(req);

  const responseBody: GetMeResponse = {
    data: user,
    message: "User found.",
  };
  res.status(200).json(responseBody);
}

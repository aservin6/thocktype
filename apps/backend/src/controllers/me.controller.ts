import type { GetMeResponse } from "@thocktype/shared";
import type { Request, Response } from "express";

export async function getMe(req: Request, res: Response): Promise<void> {
  const user = req.user;
  if (!user) throw Error("Unauthorized request.");

  const responseBody: GetMeResponse = {
    data: user,
    message: "User found.",
  };
  res.status(200).json(responseBody);
}

import type { Request, Response, NextFunction } from "express";
import { createResult } from "../services/result.service.ts";
import { findUsersResults } from "../repositories/result.repository.ts";

export async function postResult(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { wpm, timeElapsed, accuracy, mode, modeValue, correct, incorrect } =
    req.body;

  try {
    const userId = req.user?.id;
    if (!userId) throw Error("Unauthorized request");
    const result = await createResult({
      user_id: userId,
      wpm,
      time_elapsed: timeElapsed,
      accuracy,
      mode,
      mode_value: modeValue,
      correct,
      incorrect,
    });

    res.status(201).json({
      data: result,
      message: "New result created successfully",
    });
  } catch (err) {
    next(err);
  }
}

export async function getUsersResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) throw Error("Unauthorized request");
    const result = await findUsersResults(userId);
    res.status(200).json({
      data: result,
      message: "Results found",
    });
  } catch (err) {
    next(err);
  }
}

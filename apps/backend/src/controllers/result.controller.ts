import type { Request, Response, NextFunction } from "express";
import { submitResult, getLeaderboard } from "../services/result.service.ts";
import {
  selectResultsByUser,
  selectUserStats,
} from "../repositories/result.repository.ts";

export async function createResult(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { wpm, timeElapsed, accuracy, mode, modeValue, correct, incorrect } =
    req.body;

  try {
    const userId = req.user?.id;
    if (!userId) throw Error("Unauthorized request");
    const result = await submitResult({
      user_id: userId,
      time_elapsed: timeElapsed,
      wpm,
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

export async function getUserResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) throw Error("Unauthorized request");
    const result = await selectResultsByUser(userId);
    res.status(200).json({
      data: result,
      message: "Results found",
    });
  } catch (err) {
    next(err);
  }
}

export async function getUserStats(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.user?.id;
    if (!userId) throw Error("Unauthorized request");
    const stats = await selectUserStats(userId);
    res.status(200).json({
      data: stats,
      message: "Stats found",
    });
  } catch (err) {
    next(err);
  }
}

export async function getLeaderboardResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  let mode = req.query.mode as string;
  let mode_value = parseInt(req.query.mode_value as string);
  let page = parseInt(req.query.page as string);
  let limit = parseInt(req.query.limit as string);

  // Default and clamp pagination params so the leaderboard endpoint is safe to call without query params.
  if (!["standard", "timed", "strict"].includes(mode)) mode = "standard";
  if (isNaN(mode_value) || mode_value < 1)
    mode_value = mode === "timed" ? 30 : 25;
  if (isNaN(page) || page < 1) page = 1;
  if (isNaN(limit) || limit < 1 || limit > 100) limit = 25;

  try {
    const results = await getLeaderboard(mode, mode_value, page, limit);
    res.status(200).json({
      data: results,
      message: "Results found",
    });
  } catch (err) {
    next(err);
  }
}

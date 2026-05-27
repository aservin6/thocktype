import type { Request, Response, NextFunction } from "express";
import { submitResult, getLeaderboard } from "../services/result.service.ts";
import {
  selectResultsByUser,
  selectUserStats,
} from "../repositories/result.repository.ts";
import type { LeaderboardResponse } from "@thockr/shared";
import {
  parseLimit,
  parseMode,
  parseModeValue,
  parsePage,
} from "@thockr/shared";

export async function createResult(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { wpm, timeElapsed, accuracy, mode, modeValue, correct, incorrect } =
    req.body;

  try {
    const userId = req.user?.id;
    if (!userId) throw Error("Unauthorized request.");
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
      message: "New result created successfully.",
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
    if (!userId) throw Error("Unauthorized request.");
    const result = await selectResultsByUser(userId);
    res.status(200).json({
      data: result,
      message: "Results found.",
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
    if (!userId) throw Error("Unauthorized request.");
    const stats = await selectUserStats(userId);
    res.status(200).json({
      data: stats,
      message: "Stats found.",
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
  const mode = parseMode(req.query.mode);
  const modeValueParam = parseModeValue(req.query.mode_value, mode);
  const modeValue = parseInt(modeValueParam, 10);
  const page = parsePage(req.query.page);
  const limit = parseLimit(req.query.limit);
  const userId = req.user?.id;

  try {
    const response: LeaderboardResponse = await getLeaderboard(
      mode,
      modeValue,
      page,
      limit,
      userId,
    );
    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
}

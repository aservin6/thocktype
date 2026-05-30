import type { Request, Response, NextFunction } from "express";
import { submitResult, getLeaderboard } from "../services/result.service.ts";
import {
  selectResultsByUser,
  selectUserStats,
} from "../repositories/result.repository.ts";
import type {
  LeaderboardResponse,
  CreateResultRequest,
  CreateResultResponse,
  GetMeResultsResponse,
  GetMeStatsResponse,
} from "@thockr/shared";
import { parseLeaderboardQuery } from "@thockr/shared";

export async function createResult(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const { wpm, timeElapsed, accuracy, mode, modeValue, correct, incorrect } =
    req.body as CreateResultRequest;

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
    const responseBody: CreateResultResponse = {
      data: result,
      message: "New result created successfully.",
    };
    res.status(201).json(responseBody);
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
    const responseBody: GetMeResultsResponse = {
      data: result,
      message: "Results found.",
    };
    res.status(200).json(responseBody);
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
    const result = await selectUserStats(userId);
    const responseBody: GetMeStatsResponse = {
      data: result,
      message: "Stats found.",
    };
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
}

export async function getLeaderboardResults(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const query = parseLeaderboardQuery(req.query);
  const userId = req.user?.id;

  try {
    const responseBody: LeaderboardResponse = await getLeaderboard(
      query.mode,
      query.modeValue,
      query.page,
      query.limit,
      userId,
    );
    res.status(200).json(responseBody);
  } catch (err) {
    next(err);
  }
}

import { isMode, MODE_VALUES_BY_MODE } from "@thockr/shared";
import type { Request, Response, NextFunction } from "express";

function rejectInvalidResult(res: Response) {
  res.status(400).json({ message: "Invalid result payload." });
}

export function validateResultInput(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const { wpm, timeElapsed, accuracy, mode, modeValue, correct, incorrect } =
    req.body;

  if (!isMode(mode)) {
    rejectInvalidResult(res);
    return;
  }
  const validWpm = typeof wpm === "number" && wpm >= 0 && wpm <= 400;
  const validTimeElapsed = typeof timeElapsed === "number" && timeElapsed > 0;
  const validAccuracy =
    typeof accuracy === "number" && accuracy >= 0 && accuracy <= 100;
  const validModeValue =
    typeof modeValue === "number" &&
    MODE_VALUES_BY_MODE[mode].includes(modeValue.toString());
  const validCorrect =
    typeof correct === "number" && Number.isInteger(correct) && correct >= 0;
  const validIncorrect =
    typeof incorrect === "number" &&
    Number.isInteger(incorrect) &&
    incorrect >= 0;

  if (!validWpm) {
    rejectInvalidResult(res);
    return;
  }
  if (!validTimeElapsed) {
    rejectInvalidResult(res);
    return;
  }
  if (!validAccuracy) {
    rejectInvalidResult(res);
    return;
  }
  if (!validModeValue) {
    rejectInvalidResult(res);
    return;
  }
  if (!validCorrect) {
    rejectInvalidResult(res);
    return;
  }
  if (!validIncorrect) {
    rejectInvalidResult(res);
    return;
  }

  const validTyped = correct + incorrect > 0;
  if (!validTyped) {
    rejectInvalidResult(res);
    return;
  }

  next();
}

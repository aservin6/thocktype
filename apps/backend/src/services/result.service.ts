import { insertResult } from "../repositories/result.repository.ts";
import { selectUserById } from "../repositories/user.repository.ts";
import type { Result } from "../types/result.ts";

export interface resultCreationDetails {
  user_id: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: string;
  mode_value: number;
  correct: number;
  incorrect: number;
}

export async function submitResult({
  user_id,
  wpm,
  time_elapsed,
  accuracy,
  mode,
  mode_value,
  correct,
  incorrect,
}: resultCreationDetails): Promise<Result> {
  const user = await selectUserById(user_id);
  if (!user) throw new Error("User does not exist");
  if (wpm < 0 || accuracy < 0) throw new Error("Result data is invalid");

  const result = await insertResult({
    user_id,
    wpm,
    time_elapsed,
    accuracy,
    mode,
    mode_value,
    correct,
    incorrect,
  });

  return result;
}

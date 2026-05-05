export type { Result, LeaderboardResult } from "@typing-test/shared";

export interface ResultCreationDetails {
  user_id: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: string;
  mode_value: number;
  correct: number;
  incorrect: number;
}

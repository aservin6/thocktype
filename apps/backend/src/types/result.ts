export type {
  Result,
  LeaderboardResult,
  UserStats,
  ModeStats,
} from "@thockr/shared";

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

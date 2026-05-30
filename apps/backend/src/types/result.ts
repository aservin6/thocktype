import type { Mode } from "@thockr/shared";

export type {
  Result,
  LeaderboardEntry,
  UserStats,
  ModeStats,
} from "@thockr/shared";

export interface ResultCreationDetails {
  user_id: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: Mode;
  mode_value: number;
  correct: number;
  incorrect: number;
}

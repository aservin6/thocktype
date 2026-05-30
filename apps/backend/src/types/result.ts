import type { Mode } from "@thocktype/shared";

export type {
  Result,
  LeaderboardEntry,
  UserStats,
  ModeStats,
} from "@thocktype/shared";

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

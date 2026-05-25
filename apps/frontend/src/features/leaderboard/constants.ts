import type { Mode } from "@thockr/shared";

export const LEADERBOARD_MODES = ["standard", "timed", "strict"] as const;
export const DEFAULT_MODE_VALUES: Record<Mode, string> = {
  standard: "25",
  timed: "30",
  strict: "25",
};
export const MODE_VALUES_BY_MODE: Record<Mode, readonly string[]> = {
  standard: ["10", "25", "50", "100"],
  timed: ["15", "30", "60", "120"],
  strict: ["10", "25", "50", "100"],
};

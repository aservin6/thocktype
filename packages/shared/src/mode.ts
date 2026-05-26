import type { Mode } from "./engine/types";

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

export function isMode(value: unknown): value is Mode {
  if (typeof value !== "string") return false;
  const allowedModes = LEADERBOARD_MODES as readonly string[];
  return allowedModes.includes(value);
}

export function parseMode(value: unknown): Mode {
  if (isMode(value)) {
    return value;
  }
  return "standard";
}

export function parseModeValue(value: unknown, mode: Mode): string {
  if (typeof value === "string" && MODE_VALUES_BY_MODE[mode].includes(value)) {
    return value;
  }
  return DEFAULT_MODE_VALUES[mode];
}

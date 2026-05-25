import type { Mode } from "@thockr/shared";
import {
  DEFAULT_MODE_VALUES,
  LEADERBOARD_MODES,
  MODE_VALUES_BY_MODE,
} from "../constants";

export function isMode(value: string | null): value is Mode {
  if (!value) return false;
  const widenedModes = LEADERBOARD_MODES as readonly string[];
  return widenedModes.includes(value);
}

export function parseMode(value: string | null): Mode {
  if (isMode(value)) {
    return value;
  }
  return "standard";
}

export function parseModeValue(value: string | null, mode: Mode): string {
  if (value && MODE_VALUES_BY_MODE[mode].includes(value)) {
    return value;
  }
  return DEFAULT_MODE_VALUES[mode];
}

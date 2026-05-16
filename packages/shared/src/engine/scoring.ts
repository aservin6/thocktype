import type { EngineState } from "./types.ts";
import { countCorrect, countTyped } from "./utils.ts";

export function getElapsedTime(state: EngineState): number {
  if (!state.startTime) return 0;

  if (state.endTime && state.status === "finished") {
    return state.endTime - state.startTime;
  }

  if (state.status === "running") {
    return Date.now() - state.startTime;
  }

  return 0;
}

export function getAccuracy(state: EngineState): number {
  const total = countTyped(state);
  if (total === 0) return 0;

  const correctCount = countCorrect(state);
  return (correctCount / total) * 100;
}

// Standard WPM convention: a "word" is 5 correctly typed characters. Counting
// actual word boundaries would penalize long words and reward short ones.
export function getWPM(state: EngineState): number {
  const elapsedMs = getElapsedTime(state);
  if (elapsedMs === 0) return 0;

  const minutes = elapsedMs / 60000;
  const words = countCorrect(state) / 5;

  return words / minutes;
}

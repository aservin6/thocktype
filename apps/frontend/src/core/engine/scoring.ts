import type { EngineState } from "./types";

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
  const total = state.input.length;
  if (total === 0) return 0;

  return (state.correctCount / total) * 100;
}

export function getWPM(state: EngineState): number {
  const elapsedMs = getElapsedTime(state);
  if (elapsedMs === 0) return 0;

  const minutes = elapsedMs / 60000;
  const words = state.correctCount / 5;

  return words / minutes;
}

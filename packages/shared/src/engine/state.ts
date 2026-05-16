import { EngineState } from "./types.ts";

// Splits the target sentence into per-word state. filter(Boolean) drops empty
// entries from leading/trailing/duplicate spaces so the engine never has to
// guard against zero-length target words.
export function createInitialState(targetText: string): EngineState {
  const words = targetText
    .split(" ")
    .filter(Boolean)
    .map((word) => ({ target: word, typed: "" }));

  return {
    status: "idle",
    words,
    currentWordIndex: 0,
    mode: "standard",
    startTime: null,
    endTime: null,
  };
}

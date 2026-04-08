import type { EngineState } from "../types.ts";

// Minimal Context for Engine Modes
export interface EngineContext {
  isComplete(result: "correct" | "incorrect"): boolean;
  getState(): EngineState;
  getElapsedTime(): number;
}

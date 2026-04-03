import type { EngineState } from "../types";

// Minimal Context for Engine Modes
export interface EngineContext {
  isComplete(result: "correct" | "incorrect"): boolean;
  getState(): EngineState;
  getElapsedTime(): number;
}

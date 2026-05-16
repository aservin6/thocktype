import type { EngineContext } from "../context/EngineContext.ts";
import type { Mode } from "../types.ts";

// Interface for each Typing Mode
export interface TypingModeStrategy {
  shouldFinishOnCharacter(
    engine: EngineContext,
    result: "correct" | "incorrect",
  ): boolean;

  shouldFinishOnTick(engine: EngineContext): boolean;
  getModeName(): Mode;
  getTimeLimit?(): number | null;
}

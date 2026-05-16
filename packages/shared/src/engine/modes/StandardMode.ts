import type { EngineContext } from "../context/EngineContext.ts";
import type { Mode } from "../types.ts";
import type { TypingModeStrategy } from "./TypingModeStrategy.ts";

export class StandardMode implements TypingModeStrategy {
  // Engine stops once all words have been typed
  shouldFinishOnCharacter(
    engine: EngineContext,
    result: "correct" | "incorrect",
  ) {
    return engine.isComplete(result);
  }

  // No tick to finish() logic needed for non timed mode
  shouldFinishOnTick() {
    return false;
  }
  getModeName(): Mode {
    return "standard";
  }
}

import type { EngineContext } from "../context/EngineContext";
import type { Mode } from "../types";
import type { TypingModeStrategy } from "./TypingModeStrategy";

export class StrictMode implements TypingModeStrategy {
  // Engine stops once all words have been typed
  // a single mistake finishes test
  shouldFinishOnCharacter(
    engine: EngineContext,
    result: "correct" | "incorrect",
  ) {
    if (result === "incorrect") return true;
    return engine.isComplete(result);
  }

  // No tick to finish() logic needed for non timed mode
  shouldFinishOnTick() {
    return false;
  }
  getModeName(): Mode {
    return "strict";
  }
}

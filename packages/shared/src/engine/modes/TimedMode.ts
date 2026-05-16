import type { EngineContext } from "../context/EngineContext.ts";
import type { Mode } from "../types.ts";
import type { TypingModeStrategy } from "./TypingModeStrategy.ts";

export class TimedMode implements TypingModeStrategy {
  // Needs a timeLimitMs for construction
  constructor(private readonly timeLimitMs: number) {}

  // Engine doesn't stop until time runs out, thus no finish logic
  shouldFinishOnCharacter() {
    return false;
  }

  // Tick to check if time has exceeded timeLimitMs
  // then finish()
  shouldFinishOnTick(engine: EngineContext) {
    return engine.getElapsedTime() >= this.timeLimitMs;
  }
  getModeName(): Mode {
    return "timed";
  }
  getTimeLimit(): number {
    return this.timeLimitMs;
  }
}

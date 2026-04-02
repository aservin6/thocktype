import { TimedMode, StandardMode, StrictMode } from "../core/engine/modes";
import type { Mode } from "../core/engine/types";
import { TypingEngine } from "../core/engine/TypingEngine";
import { generateText } from "./generate-text";

export function getEngineFromMode(
  mode: Mode,
  wordCount: number,
  timeLimit: number,
) {
  if (mode === "timed") {
    wordCount = 25;
  }
  const text = generateText(wordCount);
  switch (mode) {
    case "timed":
      return new TypingEngine(text, new TimedMode(timeLimit));
    case "strict":
      return new TypingEngine(text, new StrictMode());
    default:
      return new TypingEngine(text, new StandardMode());
  }
}

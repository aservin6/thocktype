import {
  TimedMode,
  StandardMode,
  StrictMode,
  type Mode,
} from "@thockr/shared";
import { ObservableTypingEngine } from "../engine/ObservableTypingEngine";
import { generateText } from "./generate-text";

export function getEngineFromMode(
  mode: Mode,
  wordCount: number,
  timeLimit: number,
) {
  // Timed mode ignores the user-selected word count and uses a fixed pool.
  // The test ends on time, not when words run out, so the count just needs to
  // be large enough that a fast typist doesn't exhaust the text mid-test.
  if (mode === "timed") {
    wordCount = 100;
  }
  const text = generateText(wordCount);
  switch (mode) {
    case "timed":
      return new ObservableTypingEngine(text, new TimedMode(timeLimit));
    case "strict":
      return new ObservableTypingEngine(text, new StrictMode());
    default:
      return new ObservableTypingEngine(text, new StandardMode());
  }
}

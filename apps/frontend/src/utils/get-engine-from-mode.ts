import {
  TimedMode,
  StandardMode,
  StrictMode,
  type Mode,
} from "@typing-test/shared";
import { ObservableTypingEngine } from "../engine/ObservableTypingEngine";
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
      return new ObservableTypingEngine(text, new TimedMode(timeLimit));
    case "strict":
      return new ObservableTypingEngine(text, new StrictMode());
    default:
      return new ObservableTypingEngine(text, new StandardMode());
  }
}

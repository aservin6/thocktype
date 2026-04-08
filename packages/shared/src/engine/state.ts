import { EngineState } from "./types";

export function createInitialState(targetText: string): EngineState {
  return {
    status: "idle",
    targetText,
    currentCharIndex: 0,
    input: "",
    charStates: new Array(targetText.length).fill("pending"),
    correctCount: 0,
    incorrectCount: 0,
    mode: "standard",
    startTime: null,
    endTime: null,
  };
}

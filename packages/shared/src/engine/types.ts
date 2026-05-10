// State is organized per-word rather than as a flat input string. Each word
// owns its typed input independently, which lets the engine model overflow
// (typed.length > target.length) and lets the user advance or skip words by
// pressing space without corrupting neighboring words' state.
export interface WordState {
  target: string;
  typed: string;
}

export interface EngineState {
  status: "idle" | "running" | "finished";
  words: WordState[];
  currentWordIndex: number;
  mode: Mode;
  startTime: number | null;
  endTime: number | null;
}

export type Mode = "standard" | "strict" | "timed";

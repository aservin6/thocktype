export interface EngineState {
  status: "idle" | "running" | "finished";
  targetText: string;
  currentCharIndex: number;
  input: string;
  charStates: ("pending" | "correct" | "incorrect")[];
  correctCount: number;
  incorrectCount: number;
  mode: Mode;
  startTime: number | null;
  endTime: number | null;
}

export type Mode = "standard" | "strict" | "timed";

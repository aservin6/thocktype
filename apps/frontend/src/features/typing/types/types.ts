import type { Mode } from "@thockr/shared";

export type CreateResultPayload = {
  wpm: number;
  timeElapsed: number;
  accuracy: number;
  mode: Mode;
  modeValue: number;
  correct: number;
  incorrect: number;
};

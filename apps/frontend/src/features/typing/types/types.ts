export interface TransformedText {
  type: "word" | "space";
  characters?: string[];
  wordIndex?: number;
  startIndex: number;
}

export type CreateResultPayload = {
  wpm: number;
  timeElapsed: number;
  accuracy: number;
  mode: string;
  modeValue: number;
  correct: number;
  incorrect: number;
};

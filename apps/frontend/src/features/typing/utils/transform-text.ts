import type { TransformedText } from "../types/types";

export default function transformText(text: string | undefined) {
  const textArray: TransformedText[] = [];
  let characters: string[] = [];
  let wordIndex = 0;

  if (!text) return;
  for (const char of text) {
    if (char === " ") {
      // Flush word if it exists
      if (characters.length > 0) {
        textArray.push({
          type: "word",
          characters,
          wordIndex,
        });
        wordIndex++;
        characters = [];
      }

      // Add space after each word
      textArray.push({ type: "space" });
    } else {
      // Else push char to characters
      characters.push(char);
    }
  }
  // Final flush (end of input)
  if (characters.length > 0) {
    textArray.push({
      type: "word",
      characters,
      wordIndex,
    });
  }
  return textArray;
}

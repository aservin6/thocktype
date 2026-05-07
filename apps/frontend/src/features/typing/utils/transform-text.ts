import type { TransformedText } from "../types/types";

// Splits the target text into word and space tokens. startIndex tracks each
// token's position in the original flat string so charStates (indexed by
// character position) can be mapped onto individual rendered characters.
// Space tokens are emitted to keep startIndex in sync but are currently not
// rendered by TypingContainer.
export default function transformText(text: string | undefined) {
  const textArray: TransformedText[] = [];
  let characters: string[] = [];
  let wordIndex = 0;
  let offset = 0;

  if (!text) return;
  for (const char of text) {
    if (char === " ") {
      if (characters.length > 0) {
        textArray.push({
          type: "word",
          characters,
          wordIndex,
          startIndex: offset,
        });
        wordIndex++;
        offset += characters.length;
        characters = [];
      }

      textArray.push({ type: "space", startIndex: offset });
      offset++;
    } else {
      characters.push(char);
    }
  }
  if (characters.length > 0) {
    textArray.push({
      type: "word",
      characters,
      wordIndex,
      startIndex: offset,
    });
  }
  return textArray;
}

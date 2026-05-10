import { words } from "../data/words";

export function generateText(wordCount: number) {
  let currentIndex = words.length,
    randomIndex;

  // Fisher-Yates shuffle. Note: this mutates the module-level words array,
  // so the order changes globally on every call. This is fine here since we
  // always shuffle before slicing.
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [words[currentIndex], words[randomIndex]] = [
      words[randomIndex],
      words[currentIndex],
    ];
  }

  const testWords = words.slice(0, wordCount);

  return testWords.join(" ");
}

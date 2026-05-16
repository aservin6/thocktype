import { EngineState } from "./types.ts";

// Stat helpers shared by the engine's getters and the scoring module.
// Both treat per-position correctness independently, so overflow chars
// (typed[i] beyond target.length) never count as correct since target[i]
// is undefined there and the equality check fails naturally.

// Counts character positions where typed and target match. Iterates the union
// of both lengths so a too-short typed (skipped chars) and a too-long typed
// (overflow) are both handled by the same loop.
export function countCorrect(state: EngineState) {
  let count = 0;
  state.words.forEach((w) => {
    const length = Math.max(w.target.length, w.typed.length);

    for (let i = 0; i < length; i++) {
      if (w.target[i] === w.typed[i]) {
        count++;
      }
    }
  });
  return count;
}

// Total characters the user has actually typed across all words. Used as the
// denominator for accuracy. Includes overflow chars.
export function countTyped(state: EngineState) {
  return state.words.reduce((sum, w) => sum + w.typed.length, 0);
}

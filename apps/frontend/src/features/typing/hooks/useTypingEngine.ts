import { useTypingStore } from "../store/useTypingStore";

export function useTypingEngine() {
  const engine = useTypingStore((s) => s.engine);
  const state = useTypingStore((s) => s.state);
  const timeElapsed = useTypingStore((s) => s.timeElapsed);
  const mode = useTypingStore((s) => s.mode);
  const timeLimit = useTypingStore((s) => s.timeLimit);
  const wordCount = useTypingStore((s) => s.wordCount);

  const handleCharacter = useTypingStore((s) => s.handleCharacter);
  const handleBackspace = useTypingStore((s) => s.handleBackspace);
  const setMode = useTypingStore((s) => s.setMode);
  const setEngine = useTypingStore((s) => s.setEngine);
  const setTimeLimit = useTypingStore((s) => s.setTimeLimit);
  const setWordCount = useTypingStore((s) => s.setWordCount);

  const start = useTypingStore((s) => s.start);
  const reset = useTypingStore((s) => s.reset);
  const tick = useTypingStore((s) => s.tick);

  return {
    engine,
    state,
    timeElapsed,
    mode,
    timeLimit,
    wordCount,
    setMode,
    setEngine,
    setTimeLimit,
    setWordCount,
    handleCharacter,
    handleBackspace,
    start,
    reset,
    tick,
  };
}

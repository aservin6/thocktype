import { useEffect } from "react";
import { getEngineFromMode } from "../utils/get-engine-from-mode";
import { useTypingEngine } from "./useTypingEngine";

// Creates and registers a new engine whenever the test options change.
// Swapping the engine resets all state, so changing mode/wordCount/timeLimit
// always starts a fresh test.
export function useInitializeEngine() {
  const { setEngine, mode, wordCount, timeLimit } = useTypingEngine();

  useEffect(() => {
    setEngine(getEngineFromMode(mode, wordCount, timeLimit));
  }, [mode, setEngine, wordCount, timeLimit]);
}

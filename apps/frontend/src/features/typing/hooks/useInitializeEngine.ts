import { useEffect } from "react";
import { getEngineFromMode } from "../utils/get-engine-from-mode";
import { useTypingEngine } from "./useTypingEngine";

export function useInitializeEngine() {
  const { setEngine, mode, wordCount, timeLimit } = useTypingEngine();

  useEffect(() => {
    setEngine(getEngineFromMode(mode, wordCount, timeLimit));
  }, [mode, setEngine, wordCount, timeLimit]);
}

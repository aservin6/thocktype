import { create } from "zustand";
import { ObservableTypingEngine } from "../engine/ObservableTypingEngine";
import type { EngineState, Mode } from "@typing-test/shared";
import { getEngineFromMode } from "../utils/get-engine-from-mode";

// Types of States & Actions
type TypingState = {
  engine: ObservableTypingEngine | null;
  state: EngineState | null;
  mode: Mode;
  timeLimit: number;
  wordCount: number;
  elapsedTime: number;
  engineUnsubscribe: (() => void) | null;
};

type TypingActions = {
  setTimeLimit: (timeLimit: number) => void;
  setWordCount: (wordCount: number) => void;
  setEngine: (engine: ObservableTypingEngine) => void;
  setMode: (mode: Mode) => void;
  handleCharacter: (key: string) => void;
  handleBackspace: () => void;
  start: () => void;
  reset: () => void;
  tick: () => void;
};

type TypingStore = TypingState & TypingActions;

function syncState(engine: ObservableTypingEngine) {
  return {
    state: { ...engine.getState() },
    elapsedTime: engine.getElapsedTime(),
  };
}

// States & Action values
export const useTypingStore = create<TypingStore>()((set, get) => ({
  engine: null,
  state: null,
  mode: "standard",
  timeLimit: 30000,
  wordCount: 25,
  elapsedTime: 0,
  engineUnsubscribe: null,
  setTimeLimit: (timeLimit) => set(() => ({ timeLimit })),
  setWordCount: (wordCount) => set(() => ({ wordCount })),
  setEngine: (engine: ObservableTypingEngine) => {
    const { engineUnsubscribe } = get();

    // cleanup old engine subscription
    engineUnsubscribe?.();

    const unsubscribe = engine.subscribe((state) => {
      set({
        state,
        elapsedTime: engine.getElapsedTime(),
      });
    });

    set({
      engine,
      ...syncState(engine),
      engineUnsubscribe: unsubscribe,
    });
  },
  setMode: (mode) => {
    const { reset } = get();
    set({ mode });

    reset();
  },
  handleCharacter: (key) => {
    const { engine } = get();
    engine?.handleCharacter(key);
  },
  handleBackspace: () => {
    const { engine } = get();
    engine?.handleBackspace();
  },
  start: () => {
    const { engine } = get();

    engine?.start();
  },
  reset: () => {
    const { mode, setEngine, timeLimit, wordCount } = get();

    // create new engine instance
    const newEngine = getEngineFromMode(mode, wordCount, timeLimit);

    setEngine(newEngine);
  },
  tick: () => {
    const { engine, mode } = get();

    if (mode !== "timed") return;
    if (!engine) return;

    engine.checkTime();

    set({
      engine,
      ...syncState(engine),
    });
  },
}));

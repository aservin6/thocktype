import TypingContainer from "./TypingContainer";
import { useTypingEngine } from "../hooks/useTypingEngine";
import Results from "./Results";
import TypingTestOptions from "./TypingTestOptions";
import TestWidget from "./TestWidget";
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { postResult } from "@/features/account/api/results";
import {
  countCorrect,
  countTyped,
  getAccuracy,
  getWPM,
} from "@thocktype/shared";

export function TypingTest() {
  const [error, setError] = useState<string | null>(null);
  const {
    state,
    handleCharacter,
    handleBackspace,
    timeElapsed,
    timeLimit,
    wordCount,
  } = useTypingEngine();
  const user = useAuthStore((s) => s.user);
  // Ref instead of state so changes don't trigger a re-render. Guards against
  // React StrictMode double-invoking the effect and posting the result twice.
  const hasPosted = useRef(false);

  useEffect(() => {
    if (state?.status === "idle") {
      hasPosted.current = false;
      return;
    }
    if (state?.status !== "finished") return;
    // Skip posting if the user is not logged in — results are guest-only.
    if (hasPosted.current || !user) return;
    (async () => {
      try {
        await postResult({
          wpm: getWPM(state),
          timeElapsed: timeElapsed / 1000,
          accuracy: getAccuracy(state),
          mode: state.mode,
          correct: countCorrect(state),
          incorrect: countTyped(state) - countCorrect(state),
          modeValue: state.mode === "timed" ? timeLimit : wordCount,
        });
        hasPosted.current = true;
      } catch {
        setError("Error occured while trying to save results");
      }
    })();
  }, [state?.status]);

  function handleInput(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (!state) return;
    if (
      e.ctrlKey ||
      e.altKey ||
      e.metaKey ||
      e.shiftKey ||
      e.key === "Escape"
    ) {
      return;
    }

    if (e.key === "Backspace") {
      handleBackspace();
    } else if (e.key.length === 1) {
      // Only accept printable characters
      handleCharacter(e.key);
    }
  }

  return (
    <div className="custom-font relative flex min-h-[calc(100vh-5rem)] flex-col items-center justify-center gap-8 overflow-hidden">
      <div className="pointer-events-none absolute inset-x-0 top-10 -z-10 h-80 bg-[radial-gradient(circle_at_50%_0%,oklch(0.75_0.075_220/.16),transparent_45%)]" />
      {state?.status !== "running" && <TypingTestOptions />}
      {state?.status !== "finished" ? (
        <>
          {/* Typing Area */}
          <div className="absolute top-1/3 font-bold">
            <div className="text-primary absolute -top-1/3 left-0 text-3xl tracking-wider">
              <TestWidget />
            </div>
            {/* Invisible textarea overlaid on the text. Captures keyboard input
                without exposing a visible input field to the user. */}
            <textarea
              onKeyDown={handleInput}
              className="absolute inset-0 z-50 opacity-0"
              autoFocus
            />
            <TypingContainer />
          </div>
        </>
      ) : (
        <>
          {/* Results shown on finish */}
          <Results />
          {error && <div className="text-destructive font-bold">{error}</div>}
        </>
      )}
    </div>
  );
}

import TypingContainer from "./TypingContainer";
import { useTypingEngine } from "../hooks/useTypingEngine";
import Results from "./Results";
import TypingTestOptions from "./TypingTestOptions";
import TestWidget from "./TestWidget";

export function TypingTest() {
  const { state, handleCharacter, handleBackspace } = useTypingEngine();

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
    <div className="custom-font relative flex min-h-screen flex-col items-center justify-center gap-8 bg-neutral-800 font-mono">
      {state?.status !== "running" && <TypingTestOptions />}
      {state?.status !== "finished" ? (
        <>
          {/* Typing Area */}
          <div className="relative font-bold">
            <div className="absolute -top-1/3 left-0 text-3xl tracking-wider text-red-300">
              <TestWidget />
            </div>
            {/* Hidden textarea */}
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
        </>
      )}
    </div>
  );
}

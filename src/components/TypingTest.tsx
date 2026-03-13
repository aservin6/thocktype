import TypingContainer from "./TypingContainer";
import TypingTimer from "./TypingTimer";
import { useTypingEngine } from "../hooks/useTypingEngine";
import Results from "./Results";
import TypingTestOptions from "./TypingTestOptions";

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
    <div className="relative custom-font min-h-screen bg-neutral-800 font-mono flex flex-col items-center justify-center gap-8">
      {state?.status !== "running" && <TypingTestOptions />}
      {state?.status !== "finished" ? (
        <>
          {/* Typing Area */}
          <div className="relative font-bold">
            <TypingTimer />
            {/* Hidden textarea */}
            <textarea
              onKeyDown={handleInput}
              className="absolute inset-0 opacity-0 z-50"
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

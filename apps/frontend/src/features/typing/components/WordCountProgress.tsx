import { useTypingEngine } from "../hooks/useTypingEngine";

export default function WordCountProgress() {
  const { state, wordCount } = useTypingEngine();
  // Counts completed words by splitting on spaces. Subtracts 1 because the
  // current in-progress word doesn't count until the user types a space after it.
  const currentWordCount = (state?.input.split(" ").length ?? 0) - 1;

  return (
    <>
      {state?.status === "running" && (
        <div>
          {currentWordCount}/{wordCount}
        </div>
      )}
    </>
  );
}

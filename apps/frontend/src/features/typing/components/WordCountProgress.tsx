import { useTypingEngine } from "../hooks/useTypingEngine";

export default function WordCountProgress() {
  const { state, wordCount } = useTypingEngine();
  // currentWordIndex points at the in-progress word, which is also exactly
  // the count of words already completed.
  const currentWordCount = state?.currentWordIndex ?? 0;

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

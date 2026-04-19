import { useTypingEngine } from "../hooks/useTypingEngine";

export default function WordCountProgress() {
  const { state, wordCount } = useTypingEngine();
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

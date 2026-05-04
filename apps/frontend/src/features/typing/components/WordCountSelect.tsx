import { useTypingEngine } from "../hooks/useTypingEngine";

export default function WordCountSelect() {
  const { setWordCount, wordCount } = useTypingEngine();

  return (
    <div className="flex items-center space-x-3 font-bold text-white *:rounded *:p-1.5">
      <button
        onClick={() => setWordCount(10)}
        className={wordCount === 10 ? "bg-blue-500" : ""}
      >
        10
      </button>
      <button
        onClick={() => setWordCount(25)}
        className={wordCount === 25 ? "bg-blue-500" : ""}
      >
        25
      </button>
      <button
        onClick={() => setWordCount(50)}
        className={wordCount === 50 ? "bg-blue-500" : ""}
      >
        50
      </button>
      <button
        onClick={() => setWordCount(100)}
        className={wordCount === 100 ? "bg-blue-500" : ""}
      >
        100
      </button>
    </div>
  );
}

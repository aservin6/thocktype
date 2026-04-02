import { useTypingStore } from "../store/useTypingStore";

export default function WordCountSelect() {
  const { setWordCount, wordCount } = useTypingStore();

  return (
    <div className="flex items-center *:p-1.5 *:rounded font-bold space-x-3 text-white">
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

import { useTypingEngine } from "../hooks/useTypingEngine";

export default function TimeSelect() {
  const { timeLimit, setTimeLimit } = useTypingEngine();
  return (
    <div className="flex items-center *:p-1.5 *:rounded font-bold space-x-3 text-white">
      <button
        onClick={() => setTimeLimit(15000)}
        className={timeLimit === 15000 ? "bg-blue-500" : ""}
      >
        15
      </button>
      <button
        onClick={() => setTimeLimit(30000)}
        className={timeLimit === 30000 ? "bg-blue-500" : ""}
      >
        30
      </button>
      <button
        onClick={() => setTimeLimit(60000)}
        className={timeLimit === 60000 ? "bg-blue-500" : ""}
      >
        60
      </button>
      <button
        onClick={() => setTimeLimit(120000)}
        className={timeLimit === 120000 ? "bg-blue-500" : ""}
      >
        120
      </button>
    </div>
  );
}

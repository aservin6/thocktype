import { useTypingEngine } from "../hooks/useTypingEngine";

export function ModeSelect() {
  const { mode, setMode } = useTypingEngine();

  return (
    <div className="flex items-center space-x-3 *:p-2.5 *:font-bold *:uppercase *:text-white *:rounded-lg">
      <button
        onClick={() => setMode("standard")}
        className={`bg-blue-400 ${mode === "standard" && "select-none opacity-50"}`}
      >
        Standard
      </button>

      <button
        onClick={() => setMode("timed")}
        className={`bg-blue-400 ${mode === "timed" && "select-none opacity-50"}`}
      >
        Timed
      </button>
      <button
        onClick={() => setMode("strict")}
        className={`bg-blue-400 ${mode === "strict" && "select-none opacity-50"}`}
      >
        Strict
      </button>
    </div>
  );
}

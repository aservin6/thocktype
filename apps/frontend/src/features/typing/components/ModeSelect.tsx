import { useTypingEngine } from "../hooks/useTypingEngine";

export function ModeSelect() {
  const { mode, setMode } = useTypingEngine();

  return (
    <div className="flex items-center space-x-3 *:rounded-lg *:p-2.5 *:font-bold *:text-white *:uppercase">
      <button
        onClick={() => setMode("standard")}
        className={`bg-blue-400 ${mode === "standard" && "opacity-50 select-none"}`}
      >
        Standard
      </button>

      <button
        onClick={() => setMode("timed")}
        className={`bg-blue-400 ${mode === "timed" && "opacity-50 select-none"}`}
      >
        Timed
      </button>
      <button
        onClick={() => setMode("strict")}
        className={`bg-blue-400 ${mode === "strict" && "opacity-50 select-none"}`}
      >
        Strict
      </button>
    </div>
  );
}

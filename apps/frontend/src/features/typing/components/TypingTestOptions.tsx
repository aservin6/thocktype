import { useTypingEngine } from "../hooks/useTypingEngine";
import { ModeSelect } from "./ModeSelect";
import TimeSelect from "./TimeSelect";
import WordCountSelect from "./WordCountSelect";

export default function TypingTestOptions() {
  const { reset, mode } = useTypingEngine();
  return (
    <>
      <div className="absolute top-1/5 z-50 flex items-center space-x-4 rounded-lg bg-neutral-900 p-3">
        <button
          onClick={reset}
          className="rounded-lg bg-red-500 p-2 text-lg font-bold text-white hover:cursor-pointer"
        >
          RESET
        </button>
        <ModeSelect />
        {mode !== "timed" ? <WordCountSelect /> : <TimeSelect />}
      </div>
    </>
  );
}

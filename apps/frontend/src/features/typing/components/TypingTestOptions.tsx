import { useTypingEngine } from "../hooks/useTypingEngine";
import { ModeSelect } from "./ModeSelect";
import TimeSelect from "./TimeSelect";
import WordCountSelect from "./WordCountSelect";

export default function TypingTestOptions() {
  const { reset, mode } = useTypingEngine();
  return (
    <>
      <div className="flex absolute z-50 bg-neutral-900 p-3 top-1/5 rounded-lg items-center space-x-4">
        <button
          onClick={reset}
          className="bg-red-500 p-2 text-white font-bold text-lg rounded-lg hover:cursor-pointer"
        >
          RESET
        </button>
        <ModeSelect />
        {mode !== "timed" ? <WordCountSelect /> : <TimeSelect />}
      </div>
    </>
  );
}

import { useTypingEngine } from "../hooks/useTypingEngine";
import { ModeSelect } from "./ModeSelect";

export default function TypingTestOptions() {
  const { reset } = useTypingEngine();
  return (
    <div className="flex absolute top-1/3 items-center space-x-4">
      <ModeSelect />
      <button
        onClick={reset}
        className="bg-red-500 p-2 text-white font-bold text-lg rounded-lg hover:cursor-pointer"
      >
        RESET
      </button>
    </div>
  );
}

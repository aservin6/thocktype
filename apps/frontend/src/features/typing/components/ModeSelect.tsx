import { Button } from "@/components/ui/button";
import { useTypingEngine } from "../hooks/useTypingEngine";

export function ModeSelect() {
  const { mode, setMode } = useTypingEngine();

  return (
    <div className="flex items-center gap-2">
      {(["standard", "timed", "strict"] as const).map((option) => (
        <Button
          key={option}
          onClick={() => setMode(option)}
          type="button"
          variant={mode === option ? "default" : "outline"}
          className="capitalize"
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

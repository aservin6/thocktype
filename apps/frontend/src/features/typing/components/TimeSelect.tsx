import { Button } from "@/components/ui/button";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function TimeSelect() {
  const { timeLimit, setTimeLimit } = useTypingEngine();
  return (
    <div className="flex items-center gap-2">
      {[15000, 30000, 60000, 120000].map((value) => (
        <Button
          key={value}
          onClick={() => setTimeLimit(value)}
          type="button"
          variant={timeLimit === value ? "secondary" : "ghost"}
          size="sm"
        >
          {value / 1000}
        </Button>
      ))}
    </div>
  );
}

import { Button } from "@/components/ui/button";
import { useTypingEngine } from "../hooks/useTypingEngine";

export default function WordCountSelect() {
  const { setWordCount, wordCount } = useTypingEngine();

  return (
    <div className="flex items-center gap-2">
      {[10, 25, 50, 100].map((value) => (
        <Button
          key={value}
          onClick={() => setWordCount(value)}
          type="button"
          variant={wordCount === value ? "secondary" : "ghost"}
          size="sm"
        >
          {value}
        </Button>
      ))}
    </div>
  );
}

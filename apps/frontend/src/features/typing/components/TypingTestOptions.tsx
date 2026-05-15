import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { ModeSelect } from "./ModeSelect";
import TimeSelect from "./TimeSelect";
import WordCountSelect from "./WordCountSelect";

export default function TypingTestOptions() {
  const { reset, mode } = useTypingEngine();
  return (
    <>
      <Card className="bg-card/90 shadow-background/30 absolute top-1/6 z-50 flex-row items-center gap-3 border p-3 shadow-lg backdrop-blur">
        <Button onClick={reset} type="button" variant="destructive">
          Reset
        </Button>
        <ModeSelect />
        <div className="bg-border h-6 w-px" />
        {mode !== "timed" ? <WordCountSelect /> : <TimeSelect />}
      </Card>
    </>
  );
}

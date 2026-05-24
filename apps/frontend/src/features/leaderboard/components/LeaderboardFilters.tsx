import { Button } from "@/components/ui/button";

export default function LeaderboardFilters({
  mode,
  onChangeMode,
}: {
  mode: string;
  onChangeMode: (mode: string) => void;
}) {
  return (
    <div className="bg-secondary flex flex-col gap-1 p-3 *:text-base *:tracking-tight *:uppercase">
      <Button
        onClick={() => onChangeMode("standard")}
        variant={mode === "standard" ? "default" : "secondary"}
      >
        Standard
      </Button>
      <Button
        onClick={() => onChangeMode("timed")}
        variant={mode === "timed" ? "default" : "secondary"}
      >
        Timed
      </Button>
      <Button
        onClick={() => onChangeMode("strict")}
        variant={mode === "strict" ? "default" : "secondary"}
      >
        Strict
      </Button>
    </div>
  );
}

import { Card, CardContent } from "@/components/ui/card";
import type { LeaderboardEntry } from "@thockr/shared";

export default function CurrentUserEntryCard({
  entry,
}: {
  entry: LeaderboardEntry;
}) {
  return (
    <Card className="border-primary/35 bg-card/80 shadow-background/30 shadow-lg">
      <CardContent className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase">
            Your standing
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
            Best saved result for this board
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <Stat label="Rank" value={`#${entry.rank}`} />
          <Stat label="WPM" value={Math.round(entry.wpm).toString()} />
          <Stat label="Accuracy" value={`${Math.round(entry.accuracy)}%`} />
        </div>
      </CardContent>
    </Card>
  );
}
function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-muted-foreground text-[0.65rem] font-medium tracking-[0.22em] uppercase">
        {label}
      </p>
      <p className="text-foreground mt-1 text-lg font-semibold tracking-[-0.04em]">
        {value}
      </p>
    </div>
  );
}

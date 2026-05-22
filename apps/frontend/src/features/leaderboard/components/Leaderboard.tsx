import { Card, CardContent } from "@/components/ui/card";
import type { LeaderboardEntry } from "@thockr/shared";

export default function Leaderboard({ data }: { data: LeaderboardEntry[] }) {
  return (
    <Card className="border bg-card/80 shadow-lg shadow-background/30">
      <CardContent className="space-y-2">
        {data?.map((result) => (
          <div
            className="flex items-center justify-between border-b border-border/60 py-3 last:border-0"
            key={result.id}
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                #{result.rank}
              </span>
              <span className="font-medium text-foreground">
                {result.username}
              </span>
            </div>
            <span className="font-semibold text-primary">
              {Math.round(result.wpm)} WPM
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

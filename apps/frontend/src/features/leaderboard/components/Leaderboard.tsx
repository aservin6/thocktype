import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { LeaderboardEntry, Mode } from "@thocktype/shared";

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatNumber(value: number) {
  return numberFormat.format(Number(value));
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export default function Leaderboard({
  data,
  mode,
  modeValue,
  currentUserEntryId,
}: {
  data: LeaderboardEntry[];
  mode: Mode;
  modeValue: string;
  currentUserEntryId?: string;
}) {
  return (
    <Card className="border-border/70 bg-card/75 shadow-background/30 border shadow-lg backdrop-blur">
      <CardContent className="p-0">
        {data.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-6 py-12 text-center">
            <div className="border-border/70 bg-muted/45 text-primary flex size-12 items-center justify-center border text-lg font-semibold">
              #1
            </div>
            <div>
              <p className="text-foreground text-base font-semibold tracking-[-0.04em]">
                No scores on this board yet
              </p>
              <p className="text-muted-foreground mt-2 max-w-md text-sm leading-6">
                Complete a {mode} / {modeValue} test while signed in to claim
                the first spot.
              </p>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 border-collapse text-left text-sm">
              <thead>
                <tr className="border-border/70 bg-muted/30 border-b">
                  <TableHead className="w-24 pl-5">Rank</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead align="right">WPM</TableHead>
                  <TableHead align="right">Accuracy</TableHead>
                  <TableHead align="right">Time</TableHead>
                  <TableHead align="right" className="pr-5">
                    Date
                  </TableHead>
                </tr>
              </thead>
              <tbody>
                {data.map((result) => {
                  const isCurrentUser = currentUserEntryId === result.id;
                  return (
                    <tr
                      className={cn(
                        "border-border/45 hover:bg-muted/35 border-b transition-colors last:border-b-0",
                        isCurrentUser &&
                          "bg-primary/10 hover:bg-primary/15 shadow-[inset_3px_0_0_var(--color-primary)]",
                      )}
                      key={result.id}
                    >
                      <td className="py-4 pr-4 pl-5">
                        <span
                          className={cn(
                            "text-muted-foreground font-semibold tabular-nums",
                            result.rank <= 3 && "text-primary",
                          )}
                        >
                          #{result.rank}
                        </span>
                      </td>
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-2">
                          <span className="text-foreground font-medium">
                            {result.username}
                          </span>
                          {isCurrentUser ? (
                            <span className="border-primary/30 bg-primary/10 text-primary px-1.5 py-0.5 text-[0.65rem] font-semibold tracking-[0.16em] uppercase">
                              You
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="text-primary py-4 pr-4 text-right font-semibold tabular-nums">
                        {formatNumber(result.wpm)}
                      </td>
                      <td className="text-foreground/90 py-4 pr-4 text-right tabular-nums">
                        {formatNumber(result.accuracy)}%
                      </td>
                      <td className="text-muted-foreground py-4 pr-4 text-right tabular-nums">
                        {formatNumber(result.time_elapsed)}s
                      </td>
                      <td className="text-muted-foreground py-4 pr-5 text-right whitespace-nowrap">
                        {formatDate(result.created_at)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TableHead({
  children,
  align = "left",
  className,
}: {
  children: React.ReactNode;
  align?: "left" | "right";
  className?: string;
}) {
  return (
    <th
      className={cn(
        "text-muted-foreground py-3 pr-4 text-xs font-medium tracking-[0.22em] uppercase",
        align === "right" && "text-right",
        className,
      )}
    >
      {children}
    </th>
  );
}

import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { Result } from "@thockr/shared";

type RecentResultsTableProps = {
  results: Result[];
  compact?: boolean;
};

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatNumber(value: number) {
  return numberFormat.format(Number(value));
}

export function RecentResultsTable({
  results,
  compact = false,
}: RecentResultsTableProps) {
  return (
    <section
      className={cn(
        "flex flex-col gap-4 text-card-foreground",
        !compact && "border border-border/70 bg-card/70 p-4 shadow-sm shadow-background/30",
      )}
    >
      {!compact ? (
        <CardHeader>
          <CardTitle className="text-lg">Recent results</CardTitle>
          <CardDescription>Your latest saved typing tests.</CardDescription>
        </CardHeader>
      ) : null}

      {!compact ? <Separator className="bg-border/70" /> : null}

      {results.length === 0 ? (
        <p className="border-border/60 bg-muted/35 border p-4 text-sm text-muted-foreground">
          Complete a test while signed in to start building your history.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className={cn("w-full text-left text-sm", !compact && "min-w-140")}>
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border/70">
                <th className="py-2 pr-4 font-medium tracking-[0.18em] uppercase">WPM</th>
                <th className="py-2 pr-4 font-medium tracking-[0.18em] uppercase">Accuracy</th>
                <th className="py-2 pr-4 font-medium tracking-[0.18em] uppercase">Mode</th>
                <th className="py-2 pr-4 font-medium tracking-[0.18em] uppercase">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/40"
                  key={result.id}
                >
                  <td className="py-3 pr-4 font-semibold text-primary">
                    {formatNumber(result.wpm)}
                  </td>
                  <td className="py-3 pr-4 text-foreground/90">
                    {formatNumber(result.accuracy)}%
                  </td>
                  <td className="py-3 pr-4">
                    {result.mode}/{result.mode_value}
                  </td>
                  <td className="py-3 pr-4 text-muted-foreground">
                    {new Date(result.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

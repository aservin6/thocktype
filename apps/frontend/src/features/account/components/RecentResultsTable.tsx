import { Separator } from "@/components/ui/separator";
import type { Result } from "@typing-test/shared";

type RecentResultsTableProps = {
  results: Result[];
};

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatNumber(value: number) {
  return numberFormat.format(Number(value));
}

export function RecentResultsTable({ results }: RecentResultsTableProps) {
  return (
    <section className="flex flex-col gap-4 border border-border/70 bg-card/70 p-4 text-card-foreground shadow-sm shadow-black/10">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold tracking-normal text-foreground">
          Recent results
        </h2>
        <p className="text-sm text-muted-foreground">
          Your latest saved typing tests.
        </p>
      </div>

      <Separator className="bg-border/70" />

      {results.length === 0 ? (
        <p className="py-8 text-sm text-muted-foreground">
          Complete a test while signed in to start building your history.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-140 text-left text-sm">
            <thead className="text-xs text-muted-foreground">
              <tr className="border-b border-border/70">
                <th className="py-2 pr-4 font-medium">WPM</th>
                <th className="py-2 pr-4 font-medium">Accuracy</th>
                <th className="py-2 pr-4 font-medium">Mode</th>
                <th className="py-2 pr-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result) => (
                <tr
                  className="border-b border-border/50 transition-colors last:border-b-0 hover:bg-muted/40"
                  key={result.id}
                >
                  <td className="py-3 pr-4 font-medium text-foreground">
                    {formatNumber(result.wpm)}
                  </td>
                  <td className="py-3 pr-4">
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

import type { UserStats } from "@typing-test/shared";

type StatsOverviewProps = {
  stats: UserStats["overall"];
};

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatStat(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined) return "--";
  return `${numberFormat.format(Number(value))}${suffix}`;
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const items = [
    { label: "Best WPM", value: formatStat(stats.best_wpm) },
    { label: "Avg WPM", value: formatStat(stats.avg_wpm) },
    { label: "Accuracy", value: formatStat(stats.avg_accuracy, "%") },
    { label: "Tests", value: formatStat(stats.total_tests) },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => (
        <div
          className="flex min-h-24 flex-col justify-between border border-border/70 bg-card/70 p-4 text-card-foreground shadow-sm shadow-black/10"
          key={item.label}
        >
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="text-2xl font-semibold tracking-normal text-foreground">
            {item.value}
          </p>
        </div>
      ))}
    </section>
  );
}

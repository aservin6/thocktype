import { Gauge, Percent, Sigma, Trophy } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { UserStats } from "@thocktype/shared";

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
    { label: "Best WPM", value: formatStat(stats.best_wpm), icon: Trophy },
    { label: "Avg WPM", value: formatStat(stats.avg_wpm), icon: Gauge },
    { label: "Accuracy", value: formatStat(stats.avg_accuracy, "%"), icon: Percent },
    { label: "Tests", value: formatStat(stats.total_tests), icon: Sigma },
  ];

  return (
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <Card
            className="group relative min-h-32 overflow-hidden border p-4 transition-colors hover:border-primary/50"
            key={item.label}
          >
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="flex h-full flex-col justify-between gap-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-muted-foreground text-xs tracking-[0.2em] uppercase">
                  {item.label}
                </p>
                <Icon className="size-4 text-primary/75" />
              </div>
              <p className="text-3xl font-semibold tracking-[-0.06em] text-foreground">
                {item.value}
              </p>
            </div>
          </Card>
        );
      })}
    </section>
  );
}

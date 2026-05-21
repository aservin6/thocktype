import { BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ModeStats } from "@thockr/shared";

export const ACCOUNT_MODES = ["standard", "timed", "strict"] as const;

export type AccountMode = (typeof ACCOUNT_MODES)[number];

type ModeStatsPanelProps = {
  activeMode: AccountMode;
  activeModeValue: number;
  modeStats: ModeStats[];
  selectedStats: ModeStats | undefined;
  onModeChange: (mode: AccountMode) => void;
  onModeValueChange: (modeValue: number) => void;
};

const numberFormat = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 1,
});

function formatStat(value: number | null | undefined, suffix = "") {
  if (value === null || value === undefined) return "--";
  return `${numberFormat.format(Number(value))}${suffix}`;
}

export function ModeStatsPanel({
  activeMode,
  activeModeValue,
  modeStats,
  selectedStats,
  onModeChange,
  onModeValueChange,
}: ModeStatsPanelProps) {
  return (
    <Card className="border p-5 backdrop-blur">
      <CardHeader className="gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-start gap-3">
          <div className="border-border/70 bg-muted/70 flex size-10 items-center justify-center border text-primary">
            <BarChart3 className="size-4" />
          </div>
          <div>
            <CardTitle className="text-lg">Mode stats</CardTitle>
            <CardDescription>
              Compare your saved results by test type and target.
            </CardDescription>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCOUNT_MODES.map((mode) => (
            <Button
              className="capitalize"
              key={mode}
              onClick={() => onModeChange(mode)}
              type="button"
              variant={activeMode === mode ? "default" : "outline"}
            >
              {mode}
            </Button>
          ))}
        </div>
      </CardHeader>

      <Separator className="my-5 bg-border/70" />

      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-wrap gap-2">
          {modeStats.length > 0 ? (
            modeStats.map((stats) => (
              <Button
                key={stats.mode_value}
                onClick={() => onModeValueChange(stats.mode_value)}
                type="button"
                variant={
                  activeModeValue === stats.mode_value ? "secondary" : "outline"
                }
              >
                {stats.mode_value}
              </Button>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              No results saved for this mode yet.
            </p>
          )}
        </div>

        <div
          className={cn(
            "grid gap-3 sm:grid-cols-4",
            !selectedStats && "opacity-60",
          )}
        >
          <ModeStat label="Best WPM" value={formatStat(selectedStats?.best_wpm)} />
          <ModeStat label="Avg WPM" value={formatStat(selectedStats?.avg_wpm)} />
          <ModeStat
            label="Accuracy"
            value={formatStat(selectedStats?.avg_accuracy, "%")}
          />
          <ModeStat label="Tests" value={formatStat(selectedStats?.test_count)} />
        </div>
      </CardContent>
    </Card>
  );
}

function ModeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-border/60 bg-muted/45 flex flex-col gap-2 border p-3">
      <p className="text-muted-foreground text-xs tracking-[0.18em] uppercase">
        {label}
      </p>
      <p className="text-xl font-semibold tracking-[-0.04em] text-foreground">
        {value}
      </p>
    </div>
  );
}

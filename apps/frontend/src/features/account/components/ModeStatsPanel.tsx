import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import type { ModeStats } from "@typing-test/shared";

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
    <section className="flex flex-col gap-4 border border-border/70 bg-card/70 p-4 text-card-foreground shadow-sm shadow-black/10">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold tracking-normal text-foreground">
            Mode stats
          </h2>
          <p className="text-sm text-muted-foreground">
            Compare your saved results by test type.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {ACCOUNT_MODES.map((mode) => (
            <Button
              key={mode}
              onClick={() => onModeChange(mode)}
              type="button"
              variant={activeMode === mode ? "default" : "outline"}
            >
              {mode}
            </Button>
          ))}
        </div>
      </div>

      <Separator className="bg-border/70" />

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
    </section>
  );
}

function ModeStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 border border-border/50 bg-muted/60 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-lg font-semibold tracking-normal text-foreground">
        {value}
      </p>
    </div>
  );
}

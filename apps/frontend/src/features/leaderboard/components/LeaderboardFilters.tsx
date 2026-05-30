import { Button } from "@/components/ui/button";
import type { Mode } from "@thocktype/shared";
import {
  LEADERBOARD_MODES,
  LIMIT_OPTIONS,
  MODE_VALUES_BY_MODE,
} from "@thocktype/shared";

export default function LeaderboardFilters({
  limit,
  mode,
  modeValue,
  onChangeLimit,
  onChangeMode,
  onChangeModeValue,
}: {
  limit: number;
  mode: Mode;
  modeValue: string;
  onChangeLimit: (limit: number) => void;
  onChangeMode: (mode: Mode) => void;
  onChangeModeValue: (modeValue: string) => void;
}) {
  return (
    <aside className="border-border/70 bg-card/70 shadow-background/30 flex flex-col gap-5 border p-4 shadow-sm backdrop-blur">
      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.28em] uppercase">
          Mode
        </p>
        <div className="flex flex-col gap-2">
          {LEADERBOARD_MODES.map((value) => {
            const isActive = mode === value;
            return (
              <Button
                className="justify-start tracking-[-0.02em] capitalize"
                key={value}
                onClick={() => onChangeMode(value)}
                variant={isActive ? "default" : "outline"}
              >
                {value}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="bg-border/70 h-px" />

      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.28em] uppercase">
          Target
        </p>
        <div className="grid grid-cols-2 gap-2">
          {MODE_VALUES_BY_MODE[mode].map((value) => {
            const isActive = value === modeValue;
            return (
              <Button
                className="font-semibold tabular-nums"
                key={value}
                onClick={() => onChangeModeValue(value)}
                variant={isActive ? "secondary" : "outline"}
              >
                {value}
              </Button>
            );
          })}
        </div>
      </div>

      <div className="bg-border/70 h-px" />

      <div>
        <p className="text-muted-foreground mb-3 text-xs font-medium tracking-[0.28em] uppercase">
          Rows
        </p>
        <div className="grid grid-cols-2 gap-2">
          {LIMIT_OPTIONS.map((value) => {
            const isActive = value === limit;
            return (
              <Button
                className="font-semibold tabular-nums"
                key={value}
                onClick={() => onChangeLimit(value)}
                variant={isActive ? "secondary" : "outline"}
              >
                {value}
              </Button>
            );
          })}
        </div>
      </div>
    </aside>
  );
}

import { Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { AccountHeader } from "../components/AccountHeader";
import { ModeStatsPanel } from "../components/ModeStatsPanel";
import { RecentResultsTable } from "../components/RecentResultsTable";
import { StatsOverview } from "../components/StatsOverview";
import { getMeResults, getMeStats } from "../api/results";
import type { Mode } from "@thockr/shared";

const DEFAULT_MODE_VALUE: Record<Mode, number> = {
  standard: 25,
  timed: 30,
  strict: 25,
};

export default function AccountPage() {
  const user = useAuthStore((s) => s.user);

  const statsQuery = useQuery({
    queryKey: ["me", "stats"],
    queryFn: getMeStats,
  });

  const resultsQuery = useQuery({
    queryKey: ["me", "results"],
    queryFn: getMeResults,
  });

  const [activeMode, setActiveMode] = useState<Mode>("standard");
  const [activeSubMode, setActiveSubMode] = useState(
    DEFAULT_MODE_VALUE.standard,
  );

  const handleActiveModeChange = (mode: Mode) => {
    setActiveMode(mode);
    setActiveSubMode(DEFAULT_MODE_VALUE[mode]);
  };

  if (statsQuery.isLoading || resultsQuery.isLoading) {
    return <AccountPageMessage>Loading...</AccountPageMessage>;
  }

  if (statsQuery.isError || resultsQuery.isError) {
    return <AccountPageMessage>Error loading account data.</AccountPageMessage>;
  }

  const stats = statsQuery.data!;
  const results = resultsQuery.data!;
  const recentResults = results.slice(-20).reverse();

  const subModes = stats.by_mode.filter((entry) => entry.mode === activeMode);
  const activeModeStats = stats.by_mode.find(
    (entry) => entry.mode === activeMode && entry.mode_value === activeSubMode,
  );

  return (
    <main className="text-foreground relative mx-auto flex w-full max-w-6xl flex-col gap-6 overflow-hidden px-3 py-8 sm:px-6 lg:py-12">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-[radial-gradient(circle_at_20%_10%,oklch(0.75_0.075_220/.18),transparent_34%),radial-gradient(circle_at_78%_0%,oklch(0.72_0.08_190/.14),transparent_30%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,oklch(1_0_0/.045)_1px,transparent_1px),linear-gradient(to_bottom,oklch(1_0_0/.035)_1px,transparent_1px)] mask-[linear-gradient(to_bottom,black,transparent_72%)] bg-size-[44px_44px] opacity-35" />

      <AccountHeader user={user} />

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_21rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <StatsOverview stats={stats.overall} />
          <ModeStatsPanel
            activeMode={activeMode}
            activeModeValue={activeSubMode}
            modeStats={subModes}
            onModeChange={handleActiveModeChange}
            onModeValueChange={setActiveSubMode}
            selectedStats={activeModeStats}
          />
        </div>

        <aside className="border-border/70 bg-card/60 shadow-background/30 p-5 shadow-sm backdrop-blur xl:sticky xl:top-6 xl:self-start">
          <div className="mb-5 flex items-center gap-3">
            <div className="border-border/70 bg-muted/70 text-primary flex size-10 items-center justify-center border">
              <Activity className="size-4" />
            </div>
            <div>
              <p className="text-foreground text-sm font-semibold">
                Training log
              </p>
              <p className="text-muted-foreground text-xs">
                Latest 20 saved tests
              </p>
            </div>
          </div>
          <RecentResultsTable results={recentResults} compact />
        </aside>
      </div>
    </main>
  );
}

function AccountPageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground mx-auto flex min-h-80 w-full max-w-6xl items-center justify-center px-6 py-16 text-sm">
      <div className="border-border/70 bg-card/70 shadow-background/30 px-5 py-4 shadow-sm">
        {children}
      </div>
    </div>
  );
}

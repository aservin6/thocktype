import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import { AccountHeader } from "../components/AccountHeader";
import {
  type AccountMode,
  ModeStatsPanel,
} from "../components/ModeStatsPanel";
import { RecentResultsTable } from "../components/RecentResultsTable";
import { StatsOverview } from "../components/StatsOverview";
import { getMeResults, getMeStats } from "../api/results";

const DEFAULT_MODE_VALUE: Record<AccountMode, number> = {
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

  const [activeMode, setActiveMode] = useState<AccountMode>("standard");
  const [activeSubMode, setActiveSubMode] = useState(
    DEFAULT_MODE_VALUE.standard,
  );

  const handleActiveModeChange = (mode: AccountMode) => {
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
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-10 text-foreground">
      <AccountHeader user={user} />
      <StatsOverview stats={stats.overall} />
      <ModeStatsPanel
        activeMode={activeMode}
        activeModeValue={activeSubMode}
        modeStats={subModes}
        onModeChange={handleActiveModeChange}
        onModeValueChange={setActiveSubMode}
        selectedStats={activeModeStats}
      />
      <RecentResultsTable results={recentResults} />
    </div>
  );
}

function AccountPageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="py-16 text-sm text-muted-foreground">
      {children}
    </div>
  );
}

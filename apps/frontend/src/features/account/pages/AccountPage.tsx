import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import SignOutButton from "../../auth/components/SignOutButton";
import { getMeStats, getMeResults } from "../api/results";
import type { ModeStats } from "@typing-test/shared";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const MODES = ["standard", "timed", "strict"] as const;
type Mode = (typeof MODES)[number];

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

  const [activeTab, setActiveTab] = useState<Mode>("standard");
  const [activeSubMode, setActiveSubMode] = useState(
    DEFAULT_MODE_VALUE[activeTab],
  );

  const handleActiveModeChange = (mode: Mode) => {
    setActiveTab(mode);
    setActiveSubMode(() => DEFAULT_MODE_VALUE[activeTab]);
  };

  if (statsQuery.isLoading || resultsQuery.isLoading)
    return <div>Loading...</div>;
  if (statsQuery.isError || resultsQuery.isError)
    return <div>Error loading stats</div>;

  const stats = statsQuery.data!;
  const results = resultsQuery.data!;
  const recentResults = results.slice(-20).reverse();

  const subModes: ModeStats[] = statsQuery.data!.by_mode.filter(
    (entry) => entry.mode === activeTab,
  ); // replace with derived value
  const activeModeStats: ModeStats | undefined = statsQuery.data!.by_mode.find(
    (entry) => entry.mode === activeTab && entry.mode_value === activeSubMode,
  ); // replace with derived value

  return (
    <div>
      <h1>{user?.username}</h1>

      {/* Overall aggregate stats */}
      <div>
        <div>Best WPM: {stats.overall.best_wpm}</div>
        <div>Avg WPM: {stats.overall.avg_wpm}</div>
        <div>Avg Accuracy: {stats.overall.avg_accuracy}%</div>
        <div>Total Tests: {stats.overall.total_tests}</div>
      </div>

      {/* Mode tabs */}
      <div>
        {MODES.map((mode) => (
          <Button onClick={() => handleActiveModeChange(mode)} key={mode}>
            {mode}
          </Button>
        ))}
      </div>

      {/* Sub-mode toggles for the active tab */}
      <div>
        {subModes.map((s) => (
          <Button key={s.mode_value}>{s.mode_value}</Button>
        ))}
      </div>

      {/* Per-mode stats for the selected (mode, mode_value) */}
      {activeModeStats && (
        <div>
          <div>Best WPM: {activeModeStats.best_wpm}</div>
          <div>Avg WPM: {activeModeStats.avg_wpm}</div>
          <div>Avg Accuracy: {activeModeStats.avg_accuracy}%</div>
          <div>Tests: {activeModeStats.test_count}</div>
        </div>
      )}

      {/* Recent history table */}
      <table>
        <thead>
          <tr>
            <th>WPM</th>
            <th>Accuracy</th>
            <th>Mode</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {recentResults.map((r) => (
            <tr key={r.id}>
              <td>{r.wpm}</td>
              <td>{r.accuracy}%</td>
              <td>
                {r.mode}/{r.mode_value}
              </td>
              <td>{new Date(r.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <SignOutButton />
    </div>
  );
}

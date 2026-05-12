import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/features/auth/store/useAuthStore";
import SignOutButton from "../../auth/components/SignOutButton";
import { getMeStats, getMeResults } from "../api/results";
import type { ModeStats } from "@typing-test/shared";
import { useState } from "react";

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

  // TODO: Add state for the active tab (mode) and active sub-mode (mode_value).
  // - activeTab should default to "standard"
  // - activeSubMode should default to DEFAULT_MODE_VALUE[activeTab]
  // - When the user switches tabs, activeSubMode should reset to that mode's default
  //
  // Hint: you'll need two useState calls. When activeTab changes, what should
  // happen to activeSubMode? Think about whether a single handler that sets
  // both at once would be cleaner than two separate setters.

  const [activeTab, setActiveTab] = useState<Mode>("standard");
  const [activeSubMode, setActiveSubMode] = useState(
    DEFAULT_MODE_VALUE[activeTab],
  );

  const handleActiveModeChange = (mode: Mode) => {
    setActiveTab(mode);
    setActiveSubMode(() => DEFAULT_MODE_VALUE[activeTab]);
  };

  // TODO: Derive the available sub-modes and the selected ModeStats from statsQuery.data.
  // Given an activeTab (e.g. "timed"), filter statsQuery.data.by_mode to find all
  // entries where mode === activeTab. Those are your sub-mode options.
  // Then find the single ModeStats entry where mode === activeTab AND mode_value === activeSubMode.
  //
  // Hint: these are just .filter() and .find() calls on the by_mode array.
  // Guard against statsQuery.data being undefined.

  const subModes: ModeStats[] = []; // replace with derived value
  const activeModeStats: ModeStats | undefined = undefined; // replace with derived value

  if (statsQuery.isLoading || resultsQuery.isLoading)
    return <div>Loading...</div>;
  if (statsQuery.isError || resultsQuery.isError)
    return <div>Error loading stats</div>;

  const stats = statsQuery.data!;
  const results = resultsQuery.data!;
  const recentResults = results.slice(-20).reverse();

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
          <button key={mode}>{mode}</button>
        ))}
      </div>

      {/* Sub-mode toggles for the active tab */}
      <div>
        {subModes.map((s) => (
          <button key={s.mode_value}>{s.mode_value}</button>
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

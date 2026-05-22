import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { LeaderboardEntry } from "@thockr/shared";
import { useSearchParams } from "react-router";
import Leaderboard from "../components/Leaderboard";
import { getLeaderboardResults } from "../api/leaderboard";

const modeValues = { standard: "25", timed: "30", strict: "25" };

export default function LeaderboardPage() {
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "standard";
  const mode_value =
    searchParams.get("mode_value") ??
    modeValues[mode as keyof typeof modeValues];

  const query = useQuery({
    queryKey: ["leaderboard", mode, mode_value],
    queryFn: () => getLeaderboardResults(mode, mode_value),
    staleTime: 5 * 60 * 1000,
  });

  if (query.isLoading) return <PageMessage>Loading leaderboard...</PageMessage>;
  if (query.isError)
    return <PageMessage>Error loading leaderboard.</PageMessage>;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-10">
      <div>
        <p className="text-muted-foreground text-xs font-medium tracking-[0.35em] uppercase">
          Global pace
        </p>
        <h1 className="text-foreground mt-2 text-3xl font-semibold tracking-[-0.05em]">
          Leaderboard
        </h1>
      </div>
      {query.data?.currentUserEntry ? (
        <CurrentUserEntryCard entry={query.data.currentUserEntry} />
      ) : null}
      {query.data && <Leaderboard data={query.data.data} />}
    </main>
  );
}

function CurrentUserEntryCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <Card className="border-primary/35 bg-card/80 shadow-lg shadow-background/30">
      <CardContent className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-medium tracking-[0.3em] text-primary uppercase">
            Your standing
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Best saved result for this board
          </p>
        </div>
        <div className="grid grid-cols-3 gap-4 text-right">
          <Stat label="Rank" value={`#${entry.rank}`} />
          <Stat label="WPM" value={Math.round(entry.wpm).toString()} />
          <Stat label="Accuracy" value={`${Math.round(entry.accuracy)}%`} />
        </div>
      </CardContent>
    </Card>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[0.65rem] font-medium tracking-[0.22em] text-muted-foreground uppercase">
        {label}
      </p>
      <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-foreground">
        {value}
      </p>
    </div>
  );
}

function PageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground mx-auto flex min-h-80 max-w-4xl items-center justify-center">
      {children}
    </div>
  );
}

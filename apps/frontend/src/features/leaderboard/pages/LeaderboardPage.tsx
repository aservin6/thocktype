import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { LeaderboardEntry } from "@thockr/shared";
import { useSearchParams } from "react-router";
import Leaderboard from "../components/Leaderboard";
import { getLeaderboardResults } from "../api/leaderboard";
import LeaderboardControls from "../components/LeaderboardControls";

const modeValues = { standard: "25", timed: "30", strict: "25" };

export default function LeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = searchParams.get("mode") ?? "standard";
  const mode_value =
    searchParams.get("mode_value") ??
    modeValues[mode as keyof typeof modeValues];
  const page = searchParams.get("page") ?? "1";
  const limit = searchParams.get("limit") ?? "25";

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const query = useQuery({
    queryKey: ["leaderboard", mode, mode_value, page, limit],
    queryFn: () =>
      getLeaderboardResults(
        mode,
        mode_value,
        parseInt(page, 10),
        parseInt(limit, 10),
      ),
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
      {query.data?.pagination && query.data?.pagination.totalPages > 1 && (
        <LeaderboardControls
          page={query.data.pagination.page}
          totalPages={query.data.pagination.totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}

function CurrentUserEntryCard({ entry }: { entry: LeaderboardEntry }) {
  return (
    <Card className="border-primary/35 bg-card/80 shadow-background/30 shadow-lg">
      <CardContent className="flex flex-col gap-4 py-1 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-primary text-xs font-medium tracking-[0.3em] uppercase">
            Your standing
          </p>
          <p className="text-muted-foreground mt-1 text-sm">
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
      <p className="text-muted-foreground text-[0.65rem] font-medium tracking-[0.22em] uppercase">
        {label}
      </p>
      <p className="text-foreground mt-1 text-lg font-semibold tracking-[-0.04em]">
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

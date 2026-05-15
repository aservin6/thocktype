import { useQuery } from "@tanstack/react-query";
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
  if (query.isError) return <PageMessage>Error loading leaderboard.</PageMessage>;

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-10">
      <div>
        <p className="text-xs font-medium tracking-[0.35em] text-muted-foreground uppercase">
          Global pace
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-[-0.05em] text-foreground">
          Leaderboard
        </h1>
      </div>
      {query.data && <Leaderboard data={query.data} />}
    </main>
  );
}

function PageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-80 max-w-4xl items-center justify-center text-muted-foreground">
      {children}
    </div>
  );
}

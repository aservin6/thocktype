import { useQuery } from "@tanstack/react-query";
import Leaderboard from "../components/Leaderboard";
import { useSearchParams } from "react-router";
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

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>Error</div>;

  return (
    <div>
      Leaderboard
      {query.data && <Leaderboard data={query.data} />}
    </div>
  );
}

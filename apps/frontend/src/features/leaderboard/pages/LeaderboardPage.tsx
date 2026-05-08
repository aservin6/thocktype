import { Suspense } from "react";
import Leaderboard from "../components/Leaderboard";

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>
        Leaderboard
        <Leaderboard />
      </div>
    </Suspense>
  );
}

import type { LeaderboardResult } from "@typing-test/shared";

export default function Leaderboard({ data }: { data: LeaderboardResult[] }) {
  return (
    <div>
      {data?.map((r) => {
        return <div key={r.id}>{r.username}</div>;
      })}
    </div>
  );
}

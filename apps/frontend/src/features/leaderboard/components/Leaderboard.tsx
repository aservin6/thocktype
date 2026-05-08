import { useParams } from "react-router";
import { getLeaderboardResults } from "../api/leaderboard";
import { use } from "react";

export default function Leaderboard() {
  const { mode } = useParams();
  // const leaderboardPromise = getLeaderboardResults(mode);
  //
  // const data = use(leaderboardPromise);
  //
  return (
    <>
      <div>MODE: {mode}</div>
      <div>
        {data.map((r) => {
          return <div>{r.id}</div>;
        })}
      </div>
    </>
  );
}

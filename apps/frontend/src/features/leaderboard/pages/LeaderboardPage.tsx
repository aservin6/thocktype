import { useQuery } from "@tanstack/react-query";
import type { Mode } from "@thocktype/shared";
import { useSearchParams } from "react-router";
import Leaderboard from "../components/Leaderboard";
import { getLeaderboardResults } from "../api/leaderboard";
import LeaderboardControls from "../components/LeaderboardControls";
import LeaderboardFilters from "../components/LeaderboardFilters";
import {
  DEFAULT_MODE_VALUES,
  parseLimit,
  parseMode,
  parseModeValue,
  parsePage,
} from "@thocktype/shared";
import CurrentUserEntryCard from "../components/CurrentUserEntryCard";

export default function LeaderboardPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const rawMode = searchParams.get("mode");
  const mode = parseMode(rawMode);
  const rawModeValue = searchParams.get("mode_value");
  const modeValue = parseModeValue(rawModeValue, mode);
  const page = parsePage(searchParams.get("page"));
  const limit = parseLimit(searchParams.get("limit"));

  const handleModeChange = (mode: Mode) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode", mode);
    params.set("mode_value", DEFAULT_MODE_VALUES[mode]);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handleModeValueChange = (modeValue: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("mode_value", modeValue);
    params.set("page", "1");
    setSearchParams(params);
  };

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    setSearchParams(params);
  };

  const handleLimitChange = (limit: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("limit", limit.toString());
    params.set("page", "1");
    setSearchParams(params);
  };

  const query = useQuery({
    queryKey: ["leaderboard", mode, modeValue, page, limit],
    queryFn: () =>
      getLeaderboardResults({
        mode,
        modeValue: parseInt(modeValue, 10),
        page,
        limit,
      }),
    staleTime: 5 * 60 * 1000,
  });

  if (query.isLoading) return <PageMessage>Loading leaderboard...</PageMessage>;
  if (query.isError)
    return <PageMessage>Error loading leaderboard.</PageMessage>;

  return (
    <main className="mx-auto w-full">
      <div className="flex w-full gap-6 py-10">
        <div className="w-xs">
          <LeaderboardFilters
            limit={limit}
            mode={mode}
            modeValue={modeValue}
            onChangeLimit={handleLimitChange}
            onChangeMode={handleModeChange}
            onChangeModeValue={handleModeValueChange}
          />
        </div>
        <div className="flex w-full flex-col gap-3">
          <p className="text-muted-foreground text-xs font-medium tracking-[0.35em] uppercase">
            Global pace
          </p>
          <h1 className="text-foreground text-3xl font-semibold tracking-[-0.05em]">
            Leaderboard
          </h1>
          {query.data?.currentUserEntry ? (
            <CurrentUserEntryCard entry={query.data.currentUserEntry} />
          ) : null}
          {query.data && (
            <Leaderboard
              data={query.data.data}
              mode={mode}
              modeValue={modeValue}
              currentUserEntryId={query.data.currentUserEntry?.id}
            />
          )}
          {query.data?.pagination && query.data?.pagination.totalPages > 1 && (
            <LeaderboardControls
              page={query.data.pagination.page}
              totalPages={query.data.pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </div>
    </main>
  );
}

function PageMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-muted-foreground mx-auto flex min-h-80 max-w-4xl items-center justify-center">
      {children}
    </div>
  );
}

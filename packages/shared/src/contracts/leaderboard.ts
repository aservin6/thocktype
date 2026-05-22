import { LeaderboardEntry } from "../types/result";

export type LeaderboardResponse = {
  data: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentUserEntry: LeaderboardEntry | null;
  message: string;
};

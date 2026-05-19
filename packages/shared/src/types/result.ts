export type Result = {
  id: string;
  user_id: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: string;
  mode_value: number;
  correct: number;
  incorrect: number;
  created_at: string;
};

export type LeaderboardResult = {
  id: string;
  username: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: string;
  mode_value: number;
  correct: number;
  incorrect: number;
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  rank: number;
  username: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: string;
  mode_value: number;
  correct: number;
  incorrect: number;
  created_at: string;
};

export type ModeStats = {
  mode: string;
  mode_value: number;
  best_wpm: number;
  avg_wpm: number;
  avg_accuracy: number;
  test_count: number;
};

export type UserStats = {
  overall: {
    best_wpm: number;
    avg_wpm: number;
    avg_accuracy: number;
    total_tests: number;
  };
  by_mode: ModeStats[];
};

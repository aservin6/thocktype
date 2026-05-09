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
  created_at: Date;
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
  created_at: Date;
};

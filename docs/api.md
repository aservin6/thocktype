# Thocktype API

Base path: `/api/v1`

The app API uses JSON request/response bodies. Authentication is handled by Better Auth under `/api/auth/*`; app endpoints that require authentication use Better Auth's HTTP-only session cookie.

## Response envelopes

### Success with data

```ts
{
  data: T;
  message: string;
}
```

### Success message only

```ts
{
  message: string;
}
```

### Error

```ts
{
  message: string;
  code?: string;
  fieldErrors?: Record<string, string[]>;
}
```

`message` is a human-readable summary. `code` is a machine-readable error reason. `fieldErrors` is included for request validation errors and maps field names to one or more validation messages.

Validation error example:

```ts
{
  message: "Invalid result input.";
  code: "VALIDATION_ERROR";
  fieldErrors: {
    wpm: ["WPM cannot be negative."];
    modeValue: ["Mode value is not valid for the selected mode."];
  };
}
```

## Auth

Authentication is provided by Better Auth and mounted under `/api/auth/*`.
The frontend uses Better Auth client methods for register, sign in, sign out, forgot password, and password reset flows.

The app-specific endpoints below live under `/api/v1` and use the Better Auth session cookie for authenticated requests.

## Current user

### `GET /me`

Returns the authenticated user.

Auth required: yes

Success: `200`

```ts
{
  data: PublicUser;
  message: "User found.";
}
```

---

### `GET /me/results`

Returns all saved results for the authenticated user.

Auth required: yes

Success: `200`

```ts
{
  data: Result[];
  message: "Results found.";
}
```

---

### `GET /me/stats`

Returns aggregate stats for the authenticated user.

Auth required: yes

Success: `200`

```ts
{
  data: UserStats;
  message: "Stats found.";
}
```

## Results

### `POST /results`

Saves a completed typing test result.

Auth required: yes

Request body:

```ts
{
  wpm: number;
  timeElapsed: number;
  accuracy: number;
  mode: "standard" | "timed" | "strict";
  modeValue: number;
  correct: number;
  incorrect: number;
}
```

Validation rules:

- `wpm` must be between `0` and `400`
- `timeElapsed` must be greater than `0`
- `accuracy` must be between `0` and `100`
- `modeValue` must be valid for the selected mode
- `correct` and `incorrect` must be non-negative integers
- `correct + incorrect` must be greater than `0`

Valid mode values:

```ts
{
  standard: [10, 25, 50, 100];
  timed: [15, 30, 60, 120];
  strict: [10, 25, 50, 100];
}
```

Success: `201`

```ts
{
  data: Result;
  message: "New result created successfully.";
}
```

Validation errors return `400` with `code: "VALIDATION_ERROR"` and field-level details in `fieldErrors`.

## Leaderboard

### `GET /leaderboard`

Returns a paginated leaderboard for a mode and mode value.
Each user appears once per board, using their best result for the selected `mode + mode_value`.

Auth required: optional

If authenticated, the response may include the current user's global leaderboard entry in `currentUserEntry`.

Query params:

```ts
{
  mode?: "standard" | "timed" | "strict";
  mode_value?: string;
  page?: string;
  limit?: string;
}
```

Defaults and invalid query values are handled leniently:

- invalid/missing `mode` defaults to `standard`
- invalid/missing `mode_value` defaults based on mode
- invalid/missing `page` defaults to `1`
- invalid/missing `limit` defaults to `25`

Valid limits:

```ts
[10, 25, 50, 100]
```

Success: `200`

```ts
{
  data: LeaderboardEntry[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  currentUserEntry: LeaderboardEntry | null;
  message: "Successfully fetched leaderboard results.";
}
```

Ranking tie-breakers:

1. higher WPM
2. higher accuracy
3. lower `time_elapsed`
4. earlier `created_at`

## Shared types

### `PublicUser`

```ts
{
  id: string;
  username: string;
  email: string;
  email_verified: boolean;
  created_at: string;
}
```

### `Result`

```ts
{
  id: string;
  user_id: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: "standard" | "timed" | "strict";
  mode_value: number;
  correct: number;
  incorrect: number;
  created_at: string;
}
```

### `LeaderboardEntry`

```ts
{
  id: string;
  rank: number;
  username: string;
  wpm: number;
  time_elapsed: number;
  accuracy: number;
  mode: "standard" | "timed" | "strict";
  mode_value: number;
  correct: number;
  incorrect: number;
  created_at: string;
}
```

### `UserStats`

```ts
{
  overall: {
    best_wpm: number;
    avg_wpm: number;
    avg_accuracy: number;
    total_tests: number;
  };
  by_mode: Array<{
    mode: "standard" | "timed" | "strict";
    mode_value: number;
    best_wpm: number;
    avg_wpm: number;
    avg_accuracy: number;
    test_count: number;
  }>;
}
```

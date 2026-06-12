BEGIN;

TRUNCATE TABLE verification, account, session, results, "user"
RESTART IDENTITY CASCADE;

INSERT INTO "user" (
  id,
  name,
  email,
  email_verified,
  image,
  created_at,
  updated_at,
  username,
  display_username
)
SELECT
  '00000000-0000-0000-0000-' || LPAD(n::text, 12, '0') AS id,
  'pilot_' || LPAD(n::text, 2, '0') AS name,
  'pilot_' || LPAD(n::text, 2, '0') || '@thocktype.test' AS email,
  TRUE AS email_verified,
  NULL AS image,
  NOW() - (n || ' days')::interval AS created_at,
  NOW() - (n || ' days')::interval AS updated_at,
  'pilot_' || LPAD(n::text, 2, '0') AS username,
  'pilot_' || LPAD(n::text, 2, '0') AS display_username
FROM generate_series(1, 40) AS n;

WITH seeded_users AS (
  SELECT
    id,
    ROW_NUMBER() OVER (ORDER BY username) AS user_index
  FROM "user"
  WHERE email LIKE '%@thocktype.test'
), leaderboard_boards AS (
  SELECT *
  FROM (
    VALUES
      ('standard', 10),
      ('standard', 25),
      ('standard', 50),
      ('standard', 100),
      ('strict', 10),
      ('strict', 25),
      ('strict', 50),
      ('strict', 100),
      ('timed', 15),
      ('timed', 30),
      ('timed', 60),
      ('timed', 120)
  ) AS boards(mode, mode_value)
), generated_results AS (
  SELECT
    seeded_users.id AS user_id,
    leaderboard_boards.mode,
    leaderboard_boards.mode_value,
    attempt,
    (
      38
      + ((seeded_users.user_index * 7 + leaderboard_boards.mode_value + attempt * 5) % 82)
      + CASE leaderboard_boards.mode
          WHEN 'timed' THEN 4
          WHEN 'strict' THEN -4
          ELSE 0
        END
    )::numeric(10, 2) AS wpm,
    LEAST(
      99.5,
      80 + ((seeded_users.user_index * 3 + leaderboard_boards.mode_value + attempt) % 19)
    )::numeric(10, 2) AS accuracy,
    seeded_users.user_index
  FROM seeded_users
  CROSS JOIN leaderboard_boards
  CROSS JOIN generate_series(1, 3) AS attempt
)
INSERT INTO results (
  user_id,
  wpm,
  time_elapsed,
  accuracy,
  mode,
  mode_value,
  correct,
  incorrect,
  created_at
)
SELECT
  user_id,
  wpm,
  CASE
    WHEN mode = 'timed' THEN mode_value::numeric(10, 2)
    ELSE ROUND((mode_value * 60 / GREATEST(wpm, 1))::numeric, 2)
  END AS time_elapsed,
  accuracy,
  mode,
  mode_value,
  LEAST(
    32767,
    ROUND(((CASE WHEN mode = 'timed' THEN mode_value * 10 ELSE mode_value * 5 END) * accuracy / 100)::numeric)
  )::smallint AS correct,
  LEAST(
    32767,
    GREATEST(
      0,
      ROUND(((CASE WHEN mode = 'timed' THEN mode_value * 10 ELSE mode_value * 5 END) * (100 - accuracy) / 100)::numeric)
    )
  )::smallint AS incorrect,
  NOW() - ((user_index * 13 + attempt * 7 + mode_value) || ' minutes')::interval AS created_at
FROM generated_results;

COMMIT;

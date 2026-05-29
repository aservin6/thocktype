#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="$ROOT_DIR/apps/backend"
BACKEND_ENV_FILE="$BACKEND_DIR/.env"
SEED_FILE="$ROOT_DIR/scripts/seed-dev.sql"

if [[ -z "${REDIS_URL:-}" && -f "$BACKEND_ENV_FILE" ]]; then
  REDIS_URL="$(node --env-file="$BACKEND_ENV_FILE" -e 'console.log(process.env.REDIS_URL ?? "")')"
fi

if [[ -z "${DATABASE_URL:-}" ]]; then
  if [[ ! -f "$BACKEND_ENV_FILE" ]]; then
    echo "DATABASE_URL is not set and $BACKEND_ENV_FILE was not found." >&2
    exit 1
  fi

  DATABASE_URL="$(node --env-file="$BACKEND_ENV_FILE" -e 'console.log(process.env.DATABASE_URL ?? "")')"
fi

if [[ -z "$DATABASE_URL" ]]; then
  echo "DATABASE_URL must be set either in the environment or apps/backend/.env." >&2
  exit 1
fi

DB_INFO="$(DATABASE_URL="$DATABASE_URL" node -e '
const url = new URL(process.env.DATABASE_URL);
console.log(JSON.stringify({
  protocol: url.protocol,
  host: url.hostname,
  port: url.port || "5432",
  user: decodeURIComponent(url.username),
  password: decodeURIComponent(url.password),
  name: url.pathname.slice(1),
}));
')"

DB_PROTOCOL="$(node -e 'console.log(JSON.parse(process.argv[1]).protocol)' "$DB_INFO")"
DB_HOST="$(node -e 'console.log(JSON.parse(process.argv[1]).host)' "$DB_INFO")"
DB_PORT="$(node -e 'console.log(JSON.parse(process.argv[1]).port)' "$DB_INFO")"
DB_USER="$(node -e 'console.log(JSON.parse(process.argv[1]).user)' "$DB_INFO")"
DB_PASSWORD="$(node -e 'console.log(JSON.parse(process.argv[1]).password)' "$DB_INFO")"
DB_NAME="$(node -e 'console.log(JSON.parse(process.argv[1]).name)' "$DB_INFO")"

if [[ "$DB_PROTOCOL" != "postgres:" && "$DB_PROTOCOL" != "postgresql:" ]]; then
  echo "DATABASE_URL must use postgres:// or postgresql://." >&2
  exit 1
fi

if [[ -z "$DB_NAME" ]]; then
  echo "DATABASE_URL must include a database name." >&2
  exit 1
fi

if [[ "$DB_NAME" == "postgres" || "$DB_NAME" == "template0" || "$DB_NAME" == "template1" ]]; then
  echo "Refusing to reset protected database '$DB_NAME'." >&2
  exit 1
fi

export PGPASSWORD="$DB_PASSWORD"

echo "Resetting database '$DB_NAME' on $DB_HOST:$DB_PORT..."

psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d postgres -v ON_ERROR_STOP=1 <<SQL
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = '$DB_NAME'
  AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS "$DB_NAME";
CREATE DATABASE "$DB_NAME";
SQL

echo "Applying migrations..."
(
  cd "$BACKEND_DIR"
  DATABASE_URL="$DATABASE_URL" pnpm exec node-pg-migrate up -m migrations --tsx --envPath .env
)

echo "Seeding development data..."
psql -h "$DB_HOST" -U "$DB_USER" -p "$DB_PORT" -d "$DB_NAME" -v ON_ERROR_STOP=1 -f "$SEED_FILE"

if [[ -n "$REDIS_URL" ]]; then
  if command -v redis-cli >/dev/null 2>&1; then
    mapfile -t LEADERBOARD_CACHE_KEYS < <(redis-cli -u "$REDIS_URL" --scan --pattern 'leaderboard:*')
    if (( ${#LEADERBOARD_CACHE_KEYS[@]} > 0 )); then
      redis-cli -u "$REDIS_URL" DEL "${LEADERBOARD_CACHE_KEYS[@]}" >/dev/null
    fi
    echo "Cleared ${#LEADERBOARD_CACHE_KEYS[@]} leaderboard cache key(s)."
  else
    echo "redis-cli was not found; skipping leaderboard cache cleanup."
  fi
else
  echo "REDIS_URL is not set; skipping leaderboard cache cleanup."
fi

echo "Database reset complete."

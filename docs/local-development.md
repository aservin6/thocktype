# Local Development

This guide covers the minimum setup for running thocktype locally with the Vite frontend, Express backend, PostgreSQL, Redis, Better Auth, and seeded development data.

## Prerequisites

- Node.js with `pnpm` available through Corepack or a global install
- Docker and Docker Compose
- `psql` for the reset/seed helper script
- Optional: `redis-cli` if you want the reset script to clear Redis leaderboard cache keys

## Install dependencies

From the repository root:

```sh
pnpm install
```

## Environment files

The frontend and backend read separate environment files.

### `apps/backend/.env`

```sh
PORT=3000
FRONTEND_ORIGIN=http://localhost:5173
DATABASE_URL=postgres://postgres:postgres@localhost:5432/thocktype
REDIS_URL=redis://localhost:6379
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=replace-with-a-long-random-development-secret
RESEND_API_KEY=replace-with-a-resend-api-key
AUTH_EMAIL_FROM=Thocktype <noreply@example.com>
```

Notes:

- `BETTER_AUTH_URL` should point at the backend origin that serves `/api/auth/*`.
- `FRONTEND_ORIGIN` must match the Vite dev server origin so CORS and cookies work.
- `BETTER_AUTH_SECRET` should be a long random string. Do not reuse the example value outside local development.
- Password reset emails use Resend. If you do not need to test password reset locally, keep placeholder Resend values and avoid triggering that flow.

### `apps/frontend/.env`

```sh
VITE_API_URL=http://localhost:3000
```

`VITE_API_URL` is used for both app API requests and the Better Auth client.

## Start Postgres and Redis

```sh
docker compose up -d
```

This starts:

- PostgreSQL on `localhost:5432`
- Redis on `localhost:6379`

The database name, user, and password all match the sample `DATABASE_URL` above.

## Apply migrations

```sh
pnpm --filter @thocktype/backend db:migrate
```

Migration files live in `apps/backend/migrations` and are managed by `node-pg-migrate`.

## Seed development data

To reset the local database, run migrations, seed users/results, and clear leaderboard cache keys when `redis-cli` is available:

```sh
./scripts/reset-dev-db.sh
```

The script reads `DATABASE_URL` and `REDIS_URL` from your shell environment or `apps/backend/.env`.

Seeded users:

- Emails: `pilot_01@thocktype.test` through `pilot_40@thocktype.test`
- Password: `Password1!`

The seed data includes leaderboard results across supported modes and mode values.

## Run the app

From the repository root:

```sh
pnpm dev
```

This command starts Docker services and then runs the frontend and backend dev servers concurrently.

You can also run each app separately:

```sh
pnpm --filter @thocktype/frontend dev
pnpm --filter @thocktype/backend dev
```

## Useful commands

```sh
# Frontend lint
pnpm --filter @thocktype/frontend lint

# Backend typecheck/build
pnpm --filter @thocktype/backend build

# Shared package typecheck/build
pnpm --filter @thocktype/shared build

# Backend tests, when test files are present
pnpm --filter @thocktype/backend test

# Roll back one backend migration
pnpm --filter @thocktype/backend db:rollback

# Create a new backend migration
pnpm --filter @thocktype/backend db:create <migration-name>
```

The root workspace currently only defines `pnpm dev`; run package-level scripts for linting, testing, and typechecking.

## API documentation

The app API is documented in [`docs/api.md`](./api.md). Better Auth endpoints are mounted under `/api/auth/*`; thocktype app endpoints live under `/api/v1`.

## Troubleshooting

### Auth requests fail with CORS or cookie issues

Check that:

- `FRONTEND_ORIGIN` exactly matches the browser origin, usually `http://localhost:5173`.
- `BETTER_AUTH_URL` points to the backend, usually `http://localhost:3000`.
- `VITE_API_URL` points to the same backend origin.

### Database connection fails

Check that Docker is running and the Postgres service is healthy:

```sh
docker compose ps
```

Then verify `DATABASE_URL` matches the Compose credentials.

### Redis connection fails

Redis is used for rate limiting and leaderboard cache. The app is designed to fail open for Redis-backed paths, but local logs will show connection errors until Redis is available.

Start Redis with:

```sh
docker compose up -d redis
```

### Password reset emails do not send

Check `RESEND_API_KEY` and `AUTH_EMAIL_FROM`. The sender must be valid for your Resend account/domain.

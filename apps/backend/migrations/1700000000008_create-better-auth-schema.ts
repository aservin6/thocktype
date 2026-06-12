import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE results DROP CONSTRAINT IF EXISTS results_user_id_fkey;
    TRUNCATE TABLE results;
    ALTER TABLE results ALTER COLUMN user_id TYPE TEXT USING user_id::text;

    DROP TABLE IF EXISTS password_reset_tokens;
    DROP TABLE IF EXISTS sessions;
    DROP TABLE IF EXISTS refresh_tokens;
    DROP TABLE IF EXISTS users;

    CREATE TABLE "user" (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      image TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      username TEXT UNIQUE,
      display_username TEXT
    );

    CREATE TABLE session (
      id TEXT PRIMARY KEY,
      expires_at TIMESTAMPTZ NOT NULL,
      token TEXT NOT NULL UNIQUE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      ip_address TEXT,
      user_agent TEXT,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    );

    CREATE INDEX session_user_id_idx ON session(user_id);

    CREATE TABLE account (
      id TEXT PRIMARY KEY,
      account_id TEXT NOT NULL,
      provider_id TEXT NOT NULL,
      user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      access_token TEXT,
      refresh_token TEXT,
      id_token TEXT,
      access_token_expires_at TIMESTAMPTZ,
      refresh_token_expires_at TIMESTAMPTZ,
      scope TEXT,
      password TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX account_user_id_idx ON account(user_id);

    CREATE TABLE verification (
      id TEXT PRIMARY KEY,
      identifier TEXT NOT NULL,
      value TEXT NOT NULL,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX verification_identifier_idx ON verification(identifier);

    ALTER TABLE results
      ADD CONSTRAINT results_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES "user"(id) ON DELETE CASCADE;
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE results DROP CONSTRAINT IF EXISTS results_user_id_fkey;
    TRUNCATE TABLE results;
    ALTER TABLE results ALTER COLUMN user_id TYPE UUID USING user_id::uuid;

    DROP TABLE IF EXISTS verification;
    DROP TABLE IF EXISTS account;
    DROP TABLE IF EXISTS session;
    DROP TABLE IF EXISTS "user";

    CREATE EXTENSION IF NOT EXISTS citext;

    CREATE TABLE users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      username TEXT NOT NULL UNIQUE,
      email CITEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      email_verified BOOLEAN NOT NULL DEFAULT FALSE,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE TABLE sessions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    CREATE INDEX sessions_user_id_idx ON sessions(user_id);

    CREATE TABLE password_reset_tokens (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      token TEXT NOT NULL UNIQUE,
      expires_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE results
      ADD CONSTRAINT results_user_id_fkey
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  `);
}

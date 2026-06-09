import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE refresh_tokens RENAME TO sessions;

    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND conname = 'refresh_tokens_pkey') THEN
        ALTER TABLE sessions RENAME CONSTRAINT refresh_tokens_pkey TO sessions_pkey;
      END IF;

      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND conname = 'refresh_tokens_user_id_fkey') THEN
        ALTER TABLE sessions RENAME CONSTRAINT refresh_tokens_user_id_fkey TO sessions_user_id_fkey;
      END IF;

      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND conname = 'refresh_tokens_token_key') THEN
        ALTER TABLE sessions RENAME CONSTRAINT refresh_tokens_token_key TO sessions_token_key;
      END IF;
    END $$;

    CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP INDEX IF EXISTS sessions_user_id_idx;

    DO $$
    BEGIN
      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND conname = 'sessions_pkey') THEN
        ALTER TABLE sessions RENAME CONSTRAINT sessions_pkey TO refresh_tokens_pkey;
      END IF;

      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND conname = 'sessions_user_id_fkey') THEN
        ALTER TABLE sessions RENAME CONSTRAINT sessions_user_id_fkey TO refresh_tokens_user_id_fkey;
      END IF;

      IF EXISTS (SELECT 1 FROM pg_constraint WHERE conrelid = 'sessions'::regclass AND conname = 'sessions_token_key') THEN
        ALTER TABLE sessions RENAME CONSTRAINT sessions_token_key TO refresh_tokens_token_key;
      END IF;
    END $$;

    ALTER TABLE sessions RENAME TO refresh_tokens;
  `);
}

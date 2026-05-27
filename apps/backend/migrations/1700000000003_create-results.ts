import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    CREATE TABLE results (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      wpm NUMERIC(10, 2) NOT NULL,
      time_elapsed NUMERIC(10, 2) NOT NULL,
      accuracy NUMERIC(10, 2) NOT NULL,
      mode TEXT NOT NULL,
      mode_value INTEGER NOT NULL,
      correct SMALLINT NOT NULL,
      incorrect SMALLINT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    DROP TABLE IF EXISTS results;
  `);
}

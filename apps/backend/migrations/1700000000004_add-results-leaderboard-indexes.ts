import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.createIndex("results", ["mode", "mode_value", "user_id"], {
    name: "results_leaderboard_board_user_idx",
  });
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.dropIndex("results", ["mode", "mode_value", "user_id"], {
    name: "results_leaderboard_board_user_idx",
  });
}

import type { ColumnDefinitions, MigrationBuilder } from "node-pg-migrate";

export const shorthands: ColumnDefinitions | undefined = undefined;

export async function up(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE results
      ADD CONSTRAINT results_wpm_range
        CHECK (wpm >= 0 AND wpm <= 400),
      ADD CONSTRAINT results_time_elapsed_positive
        CHECK (time_elapsed > 0),
      ADD CONSTRAINT results_accuracy_range
        CHECK (accuracy >= 0 AND accuracy <= 100),
      ADD CONSTRAINT results_correct_non_negative
        CHECK (correct >= 0),
      ADD CONSTRAINT results_incorrect_non_negative
        CHECK (incorrect >= 0),
      ADD CONSTRAINT results_typed_count_positive
        CHECK (correct + incorrect > 0),
      ADD CONSTRAINT results_mode_valid
        CHECK (mode IN ('standard', 'timed', 'strict')),
      ADD CONSTRAINT results_mode_value_valid
        CHECK (
          (
            mode IN ('standard', 'strict')
            AND mode_value IN (10, 25, 50, 100)
          )
          OR
          (
            mode = 'timed'
            AND mode_value IN (15, 30, 60, 120)
          )
        );
  `);
}

export async function down(pgm: MigrationBuilder): Promise<void> {
  pgm.sql(`
    ALTER TABLE results
      DROP CONSTRAINT IF EXISTS results_wpm_range,
      DROP CONSTRAINT IF EXISTS results_time_elapsed_positive,
      DROP CONSTRAINT IF EXISTS results_accuracy_range,
      DROP CONSTRAINT IF EXISTS results_correct_non_negative,
      DROP CONSTRAINT IF EXISTS results_incorrect_non_negative,
      DROP CONSTRAINT IF EXISTS results_typed_count_positive,
      DROP CONSTRAINT IF EXISTS results_mode_valid,
      DROP CONSTRAINT IF EXISTS results_mode_value_valid;
  `);
}

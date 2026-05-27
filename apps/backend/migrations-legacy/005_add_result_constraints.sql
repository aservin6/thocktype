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

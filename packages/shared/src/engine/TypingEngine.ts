import type { EngineContext } from "./context/EngineContext";
import type { TypingModeStrategy } from "./modes";
import { createInitialState } from "./state";
import type { EngineState, WordState } from "./types";
import { countCorrect, countTyped } from "./utils";

// Core typing engine. Owns all mutable test state and delegates finish
// conditions to a TypingModeStrategy, keeping mode-specific logic out of this
// class. Subclass ObservableTypingEngine wraps this with an observer pattern
// so React can react to state changes without polling.
export class TypingEngine implements EngineContext {
  protected state: EngineState;
  // Strategy pattern, swapped per mode (standard, strict, timed). Determines
  // when the test ends, not how input is processed.
  private strategy: TypingModeStrategy;

  constructor(targetText: string, strategy: TypingModeStrategy) {
    this.state = createInitialState(targetText);
    this.strategy = strategy;
    this.state.mode = strategy.getModeName();
  }

  // =========================
  // Public Getters
  // =========================

  public getState(): EngineState {
    return this.state;
  }

  public getCurrentWord(): WordState {
    return this.state.words[this.state.currentWordIndex];
  }

  // getTimeLimit is optional on the strategy (only timed mode implements it).
  // Duck-type check avoids coupling this base class to a timed-specific interface.
  public getTimeLimit(): number | null {
    if ("getTimeLimit" in this.strategy) {
      return this.strategy.getTimeLimit?.() ?? null;
    }
    return null;
  }

  public getElapsedTime(): number {
    if (!this.state.startTime) return 0;
    return Date.now() - this.state.startTime;
  }

  // =========================
  // Lifecycle
  // =========================

  public start() {
    this.state.status = "running";
    this.state.startTime = Date.now();
  }

  // finish() is protected so only the engine and its subclasses can end the
  // test. External callers cannot force-finish it directly.
  protected finish() {
    this.state.status = "finished";
    this.state.endTime = Date.now();
  }

  // Resets to a fresh state using the same target text. The text is
  // reconstituted by joining each word's target with spaces, since the
  // original flat string is no longer stored anywhere.
  public reset() {
    this.state = createInitialState(
      this.state.words.map((word) => word.target).join(" "),
    );
  }

  // Called on each timer tick by the timed mode. Delegates to the strategy so
  // the engine doesn't need to know anything about time limits.
  public checkTime() {
    if (this.strategy.shouldFinishOnTick(this)) {
      this.finish();
    }
  }

  // =========================
  // Input Handling
  // =========================

  // Handles a single keystroke. Space is a word-boundary signal, not a
  // character to compare. A non-space char is appended to the current word's
  // typed buffer; growing typed beyond target.length is allowed and produces
  // overflow that the renderer displays in red.
  public handleCharacter(char: string) {
    if (this.state.status === "finished") return;

    // First keystroke auto-starts the test and begins the timer.
    if (this.state.status === "idle") {
      this.start();
    }

    const currentWord = this.state.words[this.state.currentWordIndex];
    if (char === " ") {
      // Ignore space at the start of a word so users can't skip words by
      // mashing space.
      if (currentWord.typed.length === 0) return;
      // Space after the final word ends the test regardless of whether the
      // word was completed correctly.
      if (this.state.currentWordIndex === this.state.words.length - 1) {
        this.finish();
        return;
      }
      // Otherwise advance to the next word. The current word stays as-is,
      // potentially short, partially correct, or with overflow.
      this.state.currentWordIndex++;
      return;
    }
    currentWord.typed += char;

    if (
      this.strategy.shouldFinishOnCharacter(
        this,
        char === currentWord.target[currentWord.typed.length - 1]
          ? "correct"
          : "incorrect",
      )
    )
      this.finish();
  }

  // Backspace trims one char off the current word. If the current word is
  // already empty, the cursor steps back to the previous word only if that
  // word had errors. This matches Monkeytype: correctly typed words are
  // locked once you've moved past them, but mistakes can be revisited.
  public handleBackspace() {
    if (this.state.status === "finished") return;
    const currentWord = this.state.words[this.state.currentWordIndex];

    if (currentWord.typed.length > 0) {
      currentWord.typed = currentWord.typed.slice(0, -1);
      return;
    }

    if (this.state.currentWordIndex === 0) return;

    const prevWord = this.state.words[this.state.currentWordIndex - 1];
    const prevHadErrors = prevWord.typed !== prevWord.target;
    if (prevHadErrors) this.state.currentWordIndex--;
  }

  // =========================
  // Derived Stats
  // =========================

  // Stats are computed fresh from state.words on every read. This avoids the
  // bookkeeping problem of keeping running counters consistent across
  // backspace and word-step-back, and the cost is negligible at these sizes.
  public getCorrectCount() {
    return countCorrect(this.state);
  }

  public getIncorrectCount() {
    return countTyped(this.state) - countCorrect(this.state);
  }

  public isComplete(): boolean {
    return this.state.words.every((word) => word.target === word.typed);
  }
}

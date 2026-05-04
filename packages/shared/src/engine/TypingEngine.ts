import type { EngineContext } from "./context/EngineContext";
import type { TypingModeStrategy } from "./modes";
import { createInitialState } from "./state";
import type { EngineState } from "./types";

export class TypingEngine implements EngineContext {
  protected state: EngineState;
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

  public getInput(): string {
    return this.state.input;
  }

  public getCurrentIndex(): number {
    return this.state.input.length;
  }

  public getCharState(index: number) {
    return this.state.charStates[index];
  }

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
  protected finish() {
    this.state.status = "finished";
    this.state.endTime = Date.now();
  }

  public reset() {
    this.state = createInitialState(this.state.targetText);
  }

  public checkTime() {
    if (this.strategy.shouldFinishOnTick(this)) {
      this.finish();
    }
  }

  // =========================
  // Input Handling
  // =========================

  public handleCharacter(char: string) {
    if (this.state.status === "finished") return;

    if (this.state.status === "idle") {
      this.start();
    }

    const index = this.state.input.length;

    if (index >= this.state.targetText.length) return;

    const expected = this.state.targetText[index];

    if (char === expected) {
      this.state.charStates[index] = "correct";
      this.state.correctCount++;
    } else {
      this.state.charStates[index] = "incorrect";
      this.state.incorrectCount++;
    }

    this.state.input += char;

    if (
      this.strategy.shouldFinishOnCharacter(this, this.state.charStates[index])
    ) {
      this.finish();
    }
  }

  public handleBackspace() {
    if (this.state.input.length === 0) return;

    if (this.state.status === "finished") {
      return;
    }

    const index = this.state.input.length - 1;

    const previousState = this.state.charStates[index];

    if (previousState === "correct") this.state.correctCount--;
    if (previousState === "incorrect") this.state.incorrectCount--;

    this.state.charStates[index] = "pending";
    this.state.input = this.state.input.slice(0, -1);
  }

  // =========================
  // Derived Stats
  // =========================

  public getCorrectCount(): number {
    let count = 0;
    for (let i = 0; i < this.state.input.length; i++) {
      if (this.state.input[i] === this.state.targetText[i]) {
        count++;
      }
    }
    return count;
  }

  public getIncorrectCount(): number {
    return this.state.input.length - this.getCorrectCount();
  }

  public isComplete(): boolean {
    return (
      this.state.input.length === this.state.targetText.length &&
      this.state.input.at(this.getCurrentIndex()) ===
        this.state.targetText.at(this.getCurrentIndex())
    );
  }
}

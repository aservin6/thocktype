import { TypingEngine, type EngineState } from "@thocktype/shared";

// Extends the core TypingEngine with an observer pattern so the Zustand store
// can react to engine state changes without polling or lifting all state into
// React. Each mutating method calls emit() after delegating to the parent.
export class ObservableTypingEngine extends TypingEngine {
  private listeners: Set<(state: EngineState) => void> = new Set();

  public subscribe(listener: (state: EngineState) => void) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
    // Snapshot the state before delivering to listeners so they can't mutate
    // engine internals through the reference. The words array and each word
    // object are copied (the rest is primitives), giving consumers like
    // Zustand a fresh top-level reference on every emit so equality checks
    // detect the change.
    const snapshot = {
      ...this.state,
      words: this.state.words.map((w) => ({ ...w })),
    };

    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  start() {
    super.start();
    this.emit();
  }

  protected finish() {
    super.finish();
    this.emit();
  }

  reset() {
    super.reset();
    this.emit();
  }

  handleCharacter(char: string) {
    super.handleCharacter(char);
    this.emit();
  }

  handleBackspace() {
    super.handleBackspace();
    this.emit();
  }
}

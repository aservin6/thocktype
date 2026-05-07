import { TypingEngine, type EngineState } from "@typing-test/shared";

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
    // Shallow copy to prevent listeners from holding a reference to internal
    // state. charStates needs its own copy since it's an array on the object.
    const snapshot = { ...this.state, charStates: [...this.state.charStates] };

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

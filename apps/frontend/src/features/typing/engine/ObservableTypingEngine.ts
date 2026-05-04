import { TypingEngine, type EngineState } from "@typing-test/shared";

export class ObservableTypingEngine extends TypingEngine {
  private listeners: Set<(state: EngineState) => void> = new Set();

  public subscribe(listener: (state: EngineState) => void) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit() {
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

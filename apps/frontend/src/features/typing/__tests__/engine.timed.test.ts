import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { TypingEngine, TimedMode } from "@typing-test/shared";

describe("TypingEngine - TimedMode", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts running on first character input", () => {
    const engine = new TypingEngine("hello", new TimedMode(30000));

    engine.handleCharacter("h");

    const state = engine.getState();

    expect(state.status).toBe("running");
    expect(state.startTime).not.toBeNull();
  });

  it("returns timeLimit from strategy", () => {
    const engine = new TypingEngine("hello", new TimedMode(30000));

    engine.handleCharacter("h");

    expect(engine.getTimeLimit()).toBe(30000);
  });

  it("does not finish before time limit", () => {
    const engine = new TypingEngine("hello world", new TimedMode(30000));

    engine.handleCharacter("h");

    vi.spyOn(engine, "getElapsedTime").mockReturnValue(29000);

    engine.checkTime();

    expect(engine.getState().status).toBe("running");
  });

  it("finishes when time limit is reached", () => {
    const engine = new TypingEngine("hello world", new TimedMode(30000));

    engine.handleCharacter("h");

    vi.spyOn(engine, "getElapsedTime").mockReturnValue(30000);

    engine.checkTime();

    const state = engine.getState();

    expect(state.status).toBe("finished");
    expect(state.endTime).not.toBeNull();
  });

  it("does not accept input after time expires", () => {
    const engine = new TypingEngine("hello", new TimedMode(30000));

    engine.handleCharacter("h");

    vi.spyOn(engine, "getElapsedTime").mockReturnValue(30000);

    engine.checkTime();

    engine.handleCharacter("e");

    expect(engine.getState().words[0].typed.length).toBe(1);
  });
});

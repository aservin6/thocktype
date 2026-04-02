import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import * as scoring from "../engine/scoring.ts";
import { TypingEngine } from "../engine/engine";
import { TimedMode } from "../engine/modes/TimedMode.ts";

describe("TypingEngine - TimedMode", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it("starts running on first character input", () => {
    const engine = new TypingEngine("hello", new TimedMode(30));

    engine.handleCharacter("h");

    const state = engine.getState();

    expect(state.status).toBe("running");
    expect(state.startTime).not.toBeNull();
  });

  it("sets timeLimit on first input", () => {
    const engine = new TypingEngine("hello", new TimedMode(30));

    engine.handleCharacter("h");

    expect(engine.getState().timeLimit).toBe(30);
  });

  it("does not finish before time limit", () => {
    const engine = new TypingEngine("hello world", new TimedMode(30));

    engine.handleCharacter("h");

    vi.spyOn(scoring, "getElapsedTime").mockReturnValue(29000);

    engine.checkTime();

    expect(engine.getState().status).toBe("running");
  });

  it("finishes when time limit is reached", () => {
    const engine = new TypingEngine("hello world", new TimedMode(30));

    engine.handleCharacter("h");

    vi.spyOn(scoring, "getElapsedTime").mockReturnValue(30000);

    engine.checkTime();

    const state = engine.getState();

    expect(state.status).toBe("finished");
    expect(state.endTime).not.toBeNull();
  });

  it("does not accept input after time expires", () => {
    const engine = new TypingEngine("hello", new TimedMode(30));

    engine.handleCharacter("h");

    vi.spyOn(scoring, "getElapsedTime").mockReturnValue(30000);

    engine.checkTime();

    engine.handleCharacter("e");

    expect(engine.getState().typedCharacters.length).toBe(1);
  });
});

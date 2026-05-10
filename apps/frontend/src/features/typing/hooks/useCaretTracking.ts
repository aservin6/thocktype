import { useRef, useState, useLayoutEffect } from "react";
import { useTypingEngine } from "./useTypingEngine";
import { getCharPos } from "../utils/get-char-pos";

export function useCaretTracking() {
  const { state } = useTypingEngine();
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0, height: 0 });
  const [translateY, setTranslateY] = useState(0);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevOffsetTop = useRef<number | null>(null);

  // Positions the caret in front of the next character to type. The lookup
  // is keyed by (currentWordIndex, typed.length) into the 2D charRefs.
  // useLayoutEffect runs before paint to avoid a visible frame at the wrong
  // position, and shifts the text up by one line height when the caret moves
  // into a new row to keep it on screen.
  //
  // Fallback case: if charRefs[wordIndex][charIndex] is null, the caret is
  // sitting at the end of the typed range (either at the trailing edge of a
  // completed word, or one past the last overflow char). We position against
  // the right edge of the previous character instead.
  useLayoutEffect(() => {
    const wordIndex = state?.currentWordIndex ?? 0;
    const charIndex = state?.words?.[wordIndex]?.typed.length ?? 0;
    const charEl = charRefs.current[wordIndex]?.[charIndex];
    const wrapperEl = wrapperRef.current;

    if (!charEl && wrapperEl) {
      const fallbackEl = charRefs.current[wordIndex]?.[charIndex - 1];
      if (!fallbackEl) return;
      setCaretPos(getCharPos(fallbackEl, wrapperEl, "right"));
      return;
    }
    if (!charEl || !wrapperEl) return;
    if (
      prevOffsetTop.current !== null &&
      charEl.offsetTop > prevOffsetTop.current
    ) {
      setTranslateY((prev) => prev - charEl.offsetHeight);
    }

    prevOffsetTop.current = charEl.offsetTop;
    setCaretPos(getCharPos(charEl, wrapperEl, "left"));
  }, [
    state?.currentWordIndex,
    state?.words?.[state?.currentWordIndex]?.typed.length,
  ]);

  // Resets scroll offset and caret to the start when a new test loads. Keyed
  // on state.words because the array reference changes whenever
  // createInitialState runs (i.e. on engine reset).
  useLayoutEffect(() => {
    const wordIndex = state?.currentWordIndex ?? 0;
    const charIndex = state?.words?.[wordIndex]?.typed.length ?? 0;
    const charEl = charRefs.current[wordIndex]?.[charIndex];

    const wrapperEl = wrapperRef.current;
    if (charEl && wrapperEl) {
      setCaretPos(getCharPos(charEl, wrapperEl, "left"));
    }
    setTranslateY(0);
    prevOffsetTop.current = null;
  }, [state?.words]);

  return { caretPos, translateY, charRefs, wrapperRef };
}

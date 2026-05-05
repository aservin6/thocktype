import { useRef, useState, useLayoutEffect } from "react";
import { useTypingEngine } from "./useTypingEngine";
import { getCharPos } from "../utils/get-char-pos";

export function useCaretTracking() {
  const { state } = useTypingEngine();
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0, height: 0 });
  const [translateY, setTranslateY] = useState(0);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const prevOffsetTop = useRef<number | null>(null);

  // useLayoutEffect fires before paint, avoids a visible frame with the caret in the wrong position.
  // Scrolls the text up by one line-height when the caret moves into a new row.
  useLayoutEffect(() => {
    const currentIndex = state?.input.length ?? 0;
    const charEl = charRefs.current[currentIndex];
    const wrapperEl = wrapperRef.current;

    if (!charEl || !wrapperEl) return;
    if (
      prevOffsetTop.current !== null &&
      charEl.offsetTop > prevOffsetTop.current
    ) {
      setTranslateY((prev) => prev - charEl.offsetHeight);
    }

    prevOffsetTop.current = charEl.offsetTop;
    setCaretPos(getCharPos(charEl, wrapperEl));
  }, [state?.input.length]);

  // Resets scroll offset and caret to the start when a new test loads.
  useLayoutEffect(() => {
    const charEl = charRefs.current[0];
    const wrapperEl = wrapperRef.current;
    if (charEl && wrapperEl) {
      setCaretPos(getCharPos(charEl, wrapperEl));
    }
    setTranslateY(0);
    prevOffsetTop.current = null;
  }, [state?.targetText]);

  return { caretPos, translateY, charRefs, wrapperRef };
}

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

  useLayoutEffect(() => {
    const currentIndex = state?.input.length ?? 0;
    const charEl = charRefs.current[currentIndex];
    const wrapperEl = wrapperRef.current;

    if (charEl && prevOffsetTop.current !== null) {
      if (charEl.offsetTop > prevOffsetTop.current) {
        setTranslateY((prev) => prev - charEl.offsetHeight);
      }
    }

    if (charEl) {
      prevOffsetTop.current = charEl.offsetTop;
    }

    if (charEl && wrapperEl) {
      setCaretPos(getCharPos(charEl, wrapperEl));
    }
  }, [state?.input.length]);

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

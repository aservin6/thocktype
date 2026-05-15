import { useRef, useState, useLayoutEffect } from "react";
import { useTypingEngine } from "./useTypingEngine";
import { getCharPos } from "../utils/get-char-pos";

export function useCaretTracking() {
  const { state } = useTypingEngine();
  const [caretPos, setCaretPos] = useState({ x: 0, y: 0, height: 0 });
  const [translateY, setTranslateY] = useState(0);
  const charRefs = useRef<(HTMLSpanElement | null)[][]>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const previousRowOffset = useRef<number | null>(null);
  const targetTextKey = state?.words.map((word) => word.target).join(" ");

  // Positions the caret in front of the next character to type. The lookup
  // is keyed by (currentWordIndex, typed.length) into the 2D charRefs.
  // useLayoutEffect runs before paint to avoid a visible frame at the wrong
  // position. Once the caret advances onto the third visual row or beyond,
  // the text shifts up enough to keep the active row in view without shifting
  // back down on backspace.
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

    const rowOffsets = [
      ...new Set(
        charRefs.current
          .flat()
          .filter((el): el is HTMLSpanElement => el !== null)
          .map((el) => el.offsetTop),
      ),
    ].sort((a, b) => a - b);
    const currentRowIndex = rowOffsets.indexOf(charEl.offsetTop);

    if (
      previousRowOffset.current !== null &&
      charEl.offsetTop > previousRowOffset.current
    ) {
      if (currentRowIndex < 2) {
        setTranslateY(0);
      } else {
        const rowHeight = rowOffsets[1] - rowOffsets[0];
        if (rowHeight > 0) {
          setTranslateY(-(currentRowIndex - 1) * rowHeight);
        }
      }
    }
    previousRowOffset.current = charEl.offsetTop;
    setCaretPos(getCharPos(charEl, wrapperEl, "left"));
  }, [
    state?.currentWordIndex,
    state?.words?.[state?.currentWordIndex]?.typed.length,
  ]);

  // Resets scroll offset and caret to the start when a new test loads.
  // The observable engine emits a fresh words array on every keystroke, so
  // this effect uses the target text as a more stable reset signal instead
  // of depending on state.words identity.
  useLayoutEffect(() => {
    const wordIndex = state?.currentWordIndex ?? 0;
    const charIndex = state?.words?.[wordIndex]?.typed.length ?? 0;
    const charEl = charRefs.current[wordIndex]?.[charIndex];

    const wrapperEl = wrapperRef.current;
    if (charEl && wrapperEl) {
      setCaretPos(getCharPos(charEl, wrapperEl, "left"));
    }
    setTranslateY(0);
    previousRowOffset.current = null;
  }, [targetTextKey]);

  return { caretPos, translateY, charRefs, wrapperRef };
}

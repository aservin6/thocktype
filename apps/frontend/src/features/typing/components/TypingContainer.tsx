import { useMemo } from "react";
import transformText from "../utils/transform-text";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { useInitializeEngine } from "../hooks/useInitializeEngine";
import TypingWord from "./TypingWord";
import TypingCaret from "./TypingCaret";
import { useCaretTracking } from "../hooks/useCaretTracking";

export default function TypingContainer() {
  const { state } = useTypingEngine();
  // Re-transform only when the target text changes (i.e. on reset), not on every keystroke.
  const textArray = useMemo(
    () => transformText(state?.targetText),
    [state?.targetText],
  );
  const setRef = (index: number, el: HTMLSpanElement | null) => {
    charRefs.current[index] = el;
  };

  const { caretPos, translateY, charRefs, wrapperRef } = useCaretTracking();
  useInitializeEngine();

  return (
    <div className="h-40 overflow-clip">
      {/* Rendered Text */}
      <div
        ref={wrapperRef}
        className="relative flex max-w-6xl flex-wrap text-[1.625rem] leading-14 font-semibold tracking-wider"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        <TypingCaret caretPos={caretPos} />
        {textArray?.map((item, itemIndex) => {
          // Space tokens from transformText are intentionally skipped here.
          // Spaces are rendered implicitly via word padding (px-2 on TypingWord).
          if (item.type === "word" && state) {
            return (
              <TypingWord
                characters={item.characters}
                charStates={state.charStates}
                startIndex={item.startIndex}
                setRef={setRef}
                key={item.wordIndex}
              />
            );
          }
          return null;
        })}{" "}
      </div>
    </div>
  );
}

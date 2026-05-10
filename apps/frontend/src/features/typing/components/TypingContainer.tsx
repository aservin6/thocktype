import { useTypingEngine } from "../hooks/useTypingEngine";
import { useInitializeEngine } from "../hooks/useInitializeEngine";
import TypingWord from "./TypingWord";
import TypingCaret from "./TypingCaret";
import { useCaretTracking } from "../hooks/useCaretTracking";

export default function TypingContainer() {
  const { state } = useTypingEngine();
  // Builds a 2D ref structure indexed by [wordIndex][charIndex] so the caret
  // hook can look up any rendered character span by its position in the word
  // grid. Inner arrays are created lazily as words register their first ref.
  //
  // On reset to a shorter test, trailing rows past the new word count may
  // linger. This is safe because (a) React fires ref callbacks with null on
  // unmount, so stale slots hold null rather than detached DOM nodes, and
  // (b) the caret only indexes by currentWordIndex, which is always bounded
  // by the active word count. Do not iterate charRefs.current without
  // filtering, or this assumption breaks.
  const setRef = (
    wordIndex: number,
    charIndex: number,
    el: HTMLSpanElement | null,
  ) => {
    if (!charRefs.current[wordIndex]) charRefs.current[wordIndex] = [];
    charRefs.current[wordIndex][charIndex] = el;
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
        {state?.words.map((word, wordIndex) => {
          return (
            <TypingWord
              target={word.target}
              typed={word.typed}
              wordIndex={wordIndex}
              setRef={setRef}
              key={wordIndex}
            />
          );
        })}
      </div>
    </div>
  );
}

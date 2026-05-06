import { useMemo } from "react";
import transformText from "../utils/transform-text";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { useInitializeEngine } from "../hooks/useInitializeEngine";
import TypingWord from "./TypingWord";
import TypingCaret from "./TypingCaret";
import { useCaretTracking } from "../hooks/useCaretTracking";

export default function TypingContainer() {
  const { state } = useTypingEngine();
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
          {
            /* // SPACE */
          }
          {
            /* if (item.type === "space") { */
          }
          {
            /*   const { startIndex } = item; */
          }
          {
            /*   return ( */
          }
          {
            /*     <span */
          }
          {
            /*       key={`space-${itemIndex}`} */
          }
          {
            /*       ref={(el) => { */
          }
          {
            /*         charRefs.current[startIndex] = el; */
          }
          {
            /*       }} */
          }
          {
            /*       className="relative inline-block" */
          }
          {
            /*     > */
          }
          {
            /*       {" "} */
          }
          {
            /*     </span> */
          }
          {
            /*   ); */
          }
          {
            /* } */
          }
          // WORD
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

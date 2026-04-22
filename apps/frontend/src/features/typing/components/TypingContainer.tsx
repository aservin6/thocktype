import { useLayoutEffect, useMemo, useRef, useState } from "react";
import transformText from "../utils/transform-text";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { useInitializeEngine } from "../hooks/useInitializeEngine";

export default function TypingContainer() {
  const { state } = useTypingEngine();
  const textArray = useMemo(() => transformText(state?.targetText), [state]);
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const prevOffsetTop = useRef<number | null>(null);
  const [translateY, setTranslateY] = useState(0);

  let globalIndex = 0;

  useLayoutEffect(() => {
    const currentIndex = state?.input.length ?? 0;

    const currentEl = charRefs.current[currentIndex];

    if (currentEl && prevOffsetTop.current) {
      if (currentEl.offsetTop > prevOffsetTop.current) {
        setTranslateY((prev) => prev - currentEl.offsetHeight);
      }
    }

    if (currentEl) {
      prevOffsetTop.current = currentEl.offsetTop;
    }
  }, [state?.input.length]);

  useLayoutEffect(() => {
    if (state?.status === "idle") {
      setTranslateY(0);
      prevOffsetTop.current = null;
    }
  }, [state?.status]);

  useInitializeEngine();

  return (
    <div className="h-40 overflow-clip">
      {/* Rendered Text */}
      <div
        className="flex max-w-6xl flex-wrap text-[1.625rem] leading-14 font-semibold tracking-wider"
        style={{ transform: `translateY(${translateY}px)` }}
      >
        {textArray?.map((item, itemIndex) => {
          // SPACE
          if (item.type === "space") {
            const index = globalIndex++;
            const isCurrent = index === state?.input.length;

            return (
              <span
                key={`space-${itemIndex}`}
                ref={(el) => {
                  charRefs.current[index] = el;
                }}
                className={`relative inline-block`}
              >
                {" "}
                {isCurrent && (
                  <span className="absolute top-0 left-0 h-full w-0.5 animate-pulse bg-white" />
                )}
              </span>
            );
          }

          // WORD
          if (item.type === "word") {
            return (
              <div key={`word-${item.wordIndex}`} className="inline-flex px-2">
                {item.characters?.map((char, charIndex) => {
                  const charState = state?.charStates[globalIndex];
                  const index = globalIndex++;
                  const isCurrent = index === state?.input.length;

                  const colorClass =
                    charState === "correct"
                      ? "text-white"
                      : charState === "incorrect"
                        ? "text-red-400"
                        : "text-neutral-400";

                  return (
                    <span
                      key={`char-${item.wordIndex}-${charIndex}`}
                      ref={(el) => {
                        charRefs.current[index] = el;
                      }}
                      className={`relative ${colorClass}`}
                    >
                      {char}

                      {isCurrent && (
                        <span className="absolute top-0 left-0 h-full w-0.5 animate-pulse bg-white" />
                      )}
                    </span>
                  );
                })}
              </div>
            );
          }

          return null;
        })}{" "}
      </div>
    </div>
  );
}

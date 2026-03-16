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
    <div className="h-36 overflow-clip">
      {/* Rendered Text */}
      <div
        className="flex flex-wrap max-w-6xl text-3xl font-semibold leading-relaxed tracking-wider"
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
                className={`relative inline-block w-3`}
              >
                {" "}
                {isCurrent && (
                  <span className="absolute left-0 top-0 w-0.5 h-full bg-white animate-pulse" />
                )}
              </span>
            );
          }

          // WORD
          if (item.type === "word") {
            return (
              <div key={`word-${item.wordIndex}`} className="inline-flex">
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
                        <span className="absolute left-0 top-0 w-0.5 h-full bg-white animate-pulse" />
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

import { useMemo } from "react";
import transformText from "../utils/transform-text";
import { generateText } from "../utils/generate-text";
import { useTypingEngine } from "../hooks/useTypingEngine";
import { useInitializeEngine } from "../hooks/useInitializeEngine";

export default function TypingContainer() {
  const { state } = useTypingEngine();
  const textArray = useMemo(() => transformText(generateText()), []);
  let globalIndex = 0;

  useInitializeEngine();

  return (
    <div>
      {/* Rendered Text */}
      <div className="flex flex-wrap max-w-5xl text-3xl break-keep whitespace-break-spaces font-semibold leading-relaxed tracking-wider">
        {textArray.map((item, itemIndex) => {
          // SPACE
          if (item.type === "space") {
            const index = globalIndex++;
            const isCurrent = index === state?.input.length;

            return (
              <span
                key={`space-${itemIndex}`}
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

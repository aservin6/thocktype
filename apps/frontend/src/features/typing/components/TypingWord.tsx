// Renders a single word in two passes. The first pass renders the target's
// characters, colored by comparing each position to typed. The second pass
// renders any overflow (chars typed past target.length), always red. Both
// passes register refs into the parent's 2D charRefs so the caret can locate
// any character by (wordIndex, charIndex). Spaces between words are produced
// by px-2 padding on the wrapper, so this component never renders space chars.
export default function TypingWord({
  target,
  typed,
  wordIndex,
  setRef,
}: {
  target: string;
  typed: string;
  wordIndex: number;
  setRef: (
    wordIndex: number,
    charIndex: number,
    el: HTMLSpanElement | null,
  ) => void;
}) {
  return (
    <div className="inline-flex px-2">
      {target.split("").map((char, i) => {
        const colorClass =
          i >= typed.length
            ? "text-neutral-400"
            : typed[i] === target[i]
              ? "text-white"
              : "text-red-400";
        return (
          <span
            ref={(el) => setRef(wordIndex, i, el)}
            className={colorClass}
            key={i}
          >
            {char}
          </span>
        );
      })}
      {typed
        .slice(target.length)
        .split("")
        .map((char, i) => {
          return (
            <span
              ref={(el) => setRef(wordIndex, target.length + i, el)}
              className="text-red-300"
              key={i}
            >
              {char}
            </span>
          );
        })}
    </div>
  );
}

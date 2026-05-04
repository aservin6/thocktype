export default function TypingWord({
  characters,
  charStates,
  startIndex,
  setRef,
}: {
  characters: string[] | undefined;
  charStates: ("pending" | "correct" | "incorrect")[];
  startIndex: number;
  setRef: (index: number, el: HTMLSpanElement | null) => void;
}) {
  return (
    <div className="inline-flex px-2">
      {characters?.map((char, charIndex) => {
        const charState = charStates[startIndex + charIndex];

        const colorClass =
          charState === "correct"
            ? "text-white"
            : charState === "incorrect"
              ? "text-red-400"
              : "text-neutral-400";

        return (
          <span
            ref={(el) => setRef(startIndex + charIndex, el)}
            className={`relative ${colorClass}`}
            key={`${startIndex + charIndex}`}
          >
            {char}
          </span>
        );
      })}
    </div>
  );
}

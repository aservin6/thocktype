export default function TypingCaret({
  caretPos,
}: {
  caretPos: { x: number; y: number; height: number };
}) {
  return (
    <div
      className="pointer-events-none absolute top-0 left-0 w-0.5 bg-white transition-transform duration-100 ease-out"
      style={{
        transform: `translate(${caretPos.x}px, ${caretPos.y}px)`,
        height: caretPos.height || "1em",
      }}
    />
  );
}

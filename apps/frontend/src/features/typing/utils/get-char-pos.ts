// Returns a character span's position relative to the wrapper, used to place
// the caret. The edge parameter picks which side of the character the caret
// should sit against: "left" for normal typing (caret in front of the next
// char), "right" for the fallback case where there's no char to position
// against and the caret needs to sit at the trailing edge of the previous one.
export function getCharPos(
  charEl: HTMLSpanElement,
  wrapperEl: HTMLDivElement,
  edge: "left" | "right",
) {
  const charRect = charEl.getBoundingClientRect();
  const wrapperRect = wrapperEl.getBoundingClientRect();
  return {
    x:
      edge === "left"
        ? charRect.left - wrapperRect.left
        : charRect.right - wrapperRect.left,
    y: charRect.top - wrapperRect.top,
    height: charEl.offsetHeight,
  };
}

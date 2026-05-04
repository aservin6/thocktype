export function getCharPos(charEl: HTMLSpanElement, wrapperEl: HTMLDivElement) {
  const charRect = charEl.getBoundingClientRect();
  const wrapperRect = wrapperEl.getBoundingClientRect();
  return {
    x: charRect.left - wrapperRect.left,
    y: charRect.top - wrapperRect.top,
    height: charEl.offsetHeight,
  };
}

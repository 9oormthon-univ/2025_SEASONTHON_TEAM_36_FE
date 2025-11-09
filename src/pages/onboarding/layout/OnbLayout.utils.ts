/** data-onb-no-advance="true"가 있는 타겟은 네비 제외 */
export function shouldIgnoreTarget(el: EventTarget | null) {
  let n = el as HTMLElement | null;
  while (n) {
    if (n.getAttribute && n.getAttribute("data-onb-no-advance") === "true") return true;
    n = n.parentElement;
  }
  return false;
}

/** spotRect(window) → frame 로컬 좌표 */
export function toLocalRect(spot: DOMRect, frameEl: HTMLElement) {
  const fr = frameEl.getBoundingClientRect();
  return new DOMRect(spot.x - fr.x, spot.y - fr.y, spot.width, spot.height);
}

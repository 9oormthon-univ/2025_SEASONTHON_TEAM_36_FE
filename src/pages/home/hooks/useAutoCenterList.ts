// src/pages/home/hooks/useAutoCenterList.ts
import { RefObject, useLayoutEffect, useState } from "react";

/**
 * 스크롤 컨테이너에 overflow가 없으면 중앙정렬(true), 있으면 상단정렬(false)
 * - recalcKey: 레이아웃 재측정을 유발해야 하는 외부 상태(숫자/문자열/불리언 등)
 */
export function useAutoCenterList(
  ref: RefObject<HTMLElement>,
  enabled = true,
  recalcKey?: unknown,
) {
  const [center, setCenter] = useState(true);

  useLayoutEffect(() => {
    if (!enabled) return;
    const el = ref.current;
    if (!el) return;

    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;
    let mutationObserver: MutationObserver | null = null;

    const measure = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const hasOverflow = el.scrollHeight > el.clientHeight + 1;
        setCenter(!hasOverflow);
      });
    };

    // 초기 두 프레임 측정 (폰트/이미지 로딩 보정)
    measure();
    rafId = requestAnimationFrame(measure);

    // 크기 변화 감지
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(measure);
      resizeObserver.observe(el);
      if (el.parentElement) resizeObserver.observe(el.parentElement);
    }

    // DOM 변경 감지
    mutationObserver = new MutationObserver(measure);
    mutationObserver.observe(el, { childList: true, subtree: true, characterData: true });

    // 윈도우 리사이즈
    const handleWindowResize = () => measure();
    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
      cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      if (mutationObserver) mutationObserver.disconnect();
    };
  }, [ref, enabled, recalcKey]); // 스프레드 제거, 정적 검증 OK

  return center;
}

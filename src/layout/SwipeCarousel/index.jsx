import React, { useEffect, useMemo, useRef, useState } from "react";
import { Viewport, Track, Slide } from "./styles";

/**
 * 스와이프 가능한 카드 캐러셀.
 *
 * @param {Object} props
 * @param {React.ReactNode | React.ReactNode[]} props.children - 슬라이드로 표시할 콘텐츠.
 * @param {number} [props.index] - 현재 인덱스(제어형). 미지정 시 내부 상태로 동작.
 * @param {(next: number) => void} [props.onIndexChange] - 인덱스 변경 콜백.
 * @param {boolean} [props.loop=false] - 끝↔처음 순환 여부.
 * @param {string} [props.className] - 커스텀 클래스명.
 * @param {React.CSSProperties} [props.style] - 인라인 스타일.
 * @param {string} [props["aria-label"]="카드 캐러셀"] - 접근성 라벨.
 * @returns {JSX.Element} 캐러셀 뷰포트 요소.
 */
export default function SwipeCarousel({
  children,
  index,
  onIndexChange,
  loop = false,
  className,
  style,
  "aria-label": ariaLabel = "카드 캐러셀",
}) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const count = slides.length;

  // 인덱스 관리 (controlled/uncontrolled)
  const [innerIndex, setInnerIndex] = useState(0);
  const activeIndex = clamp(index ?? innerIndex, 0, count - 1);
  const setIndex = (n) => {
    const next = clamp(n, 0, count - 1);
    if (index === undefined) setInnerIndex(next);
    onIndexChange?.(next);
  };

  // 드래그 상태
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const dragX = useRef(0);
  const dragging = useRef(false);
  const widthRef = useRef(0);

  useEffect(() => snapToIndex(activeIndex, 0), [count]);
  useEffect(() => {
    if (!dragging.current) snapToIndex(activeIndex, 300);
  }, [activeIndex]);

  function onPointerDown(e) {
    viewportRef.current?.setPointerCapture?.(e.pointerId);
    widthRef.current = viewportRef.current.clientWidth;
    startX.current = e.clientX;
    dragX.current = 0;
    dragging.current = true;
  }
  function onPointerMove(e) {
    if (!dragging.current) return;
    dragX.current = e.clientX - startX.current;
    const px = -activeIndex * widthRef.current + dragX.current;
    if (trackRef.current) {
      trackRef.current.style.transition = "none";
      trackRef.current.style.transform = `translate3d(${px}px,0,0)`;
    }
  }
  function onPointerUp() {
    if (!dragging.current) return;
    dragging.current = false;
    const W = widthRef.current || 1;
    const dx = dragX.current;
    const threshold = Math.max(40, W * 0.18);
    let next = activeIndex;
    if (Math.abs(dx) > threshold) {
      next = dx < 0 ? activeIndex + 1 : activeIndex - 1;
      if (loop) {
        if (next < 0) next = count - 1;
        if (next > count - 1) next = 0;
      }
    }
    setIndex(next);
    snapToIndex(next, 260);
  }
  function snapToIndex(i, ms = 260) {
    if (!trackRef.current || !viewportRef.current) return;
    const W = viewportRef.current.clientWidth;
    trackRef.current.style.transition = ms ? `transform ${ms}ms ease` : "none";
    trackRef.current.style.transform = `translate3d(${-i * W}px,0,0)`;
  }

  // 좌/우 화살표 키보드로 cards 넘기기
  function onKeyDown(e) {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setIndex(activeIndex - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      setIndex(activeIndex + 1);
    }
  }

  return (
    <Viewport
      ref={viewportRef}
      role="group"
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerUp}
      className={className}
      style={style}
    >
      <Track ref={trackRef}>
        {slides.map((slide, i) => (
          <Slide key={i} aria-roledescription="slide" aria-label={`${i + 1} / ${count}`}>
            {slide}
          </Slide>
        ))}
      </Track>
    </Viewport>
  );
}

function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}
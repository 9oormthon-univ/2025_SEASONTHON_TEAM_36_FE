import React, { useEffect, useMemo, useRef, useState } from "react";
import styled from "styled-components";

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

  const [innerIndex, setInnerIndex] = useState(0);
  const activeIndex = clamp(index ?? innerIndex, 0, count - 1);
  const setIndex = (n) => {
    const next = clamp(n, 0, count - 1);
    if (index === undefined) setInnerIndex(next);
    onIndexChange?.(next);
  };

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const dragX = useRef(0);
  const dragging = useRef(false);
  const widthRef = useRef(0);

  useEffect(() => snapToIndex(activeIndex, 0), [count]);
  useEffect(() => { if (!dragging.current) snapToIndex(activeIndex, 300); }, [activeIndex]);

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
    trackRef.current.style.transition = "none";
    trackRef.current.style.transform = `translate3d(${px}px,0,0)`;
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
  function onKeyDown(e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); setIndex(activeIndex - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); setIndex(activeIndex + 1); }
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

function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

const Viewport = styled.div`
  position: relative;
  overflow: hidden;
  width: 100%;
  touch-action: pan-y;
  user-select: none;
  border-radius: 16px;
  background: var(--bg-1, #fff);
  border: 1px solid var(--surface-2, #f1f4f8);
`;
const Track = styled.div` display: flex; will-change: transform; `;
const Slide = styled.div` flex: 0 0 100%; min-width: 100%; padding: 8px; `;

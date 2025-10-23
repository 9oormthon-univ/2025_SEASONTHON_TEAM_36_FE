import type {
  CSSProperties,
  KeyboardEvent as RKeyboardEvent,
  PointerEvent as RPointerEvent,
} from "react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Slide, Track, Viewport } from "./styles";

export interface SwipeCarouselProps {
  /** 슬라이드로 표시할 콘텐츠 */
  children: React.ReactNode | React.ReactNode[];
  /** 제어형 인덱스 (미지정 시 내부 상태 사용) */
  index?: number;
  /** 인덱스 변경 콜백 */
  onIndexChange?: (next: number) => void;
  /** 끝↔처음 순환 여부 */
  loop?: boolean;
  /** 커스텀 클래스명 */
  className?: string;
  /** 인라인 스타일 */
  style?: CSSProperties;
  /** 접근성 라벨 */
  "aria-label"?: string;
}

type DragState = {
  isDown: boolean;
  dragging: boolean;
  startX: number;
  startY: number;
  lastX: number;
  width: number;
  pointerId: number | null;
};

const DRAG_ACTIVATE_PX = 8; // 드래그 확정 임계값
const SWIPE_CHANGE_RATIO = 0.18; // 페이지 전환 임계비율 (화면폭의 18%)

export default function SwipeCarousel({
  children,
  index,
  onIndexChange,
  loop = false,
  className,
  style,
  "aria-label": ariaLabel = "카드 캐러셀",
}: SwipeCarouselProps) {
  const slides = useMemo(() => React.Children.toArray(children), [children]);
  const count = slides.length;

  // 인덱스 관리 (controlled/uncontrolled)
  const [innerIndex, setInnerIndex] = useState<number>(0);
  const activeIndex = clamp(index ?? innerIndex, 0, Math.max(0, count - 1));

  const setIndex = (n: number) => {
    const next = clamp(n, 0, Math.max(0, count - 1));
    if (index === undefined) setInnerIndex(next);
    onIndexChange?.(next);
  };

  // DOM refs
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  // 드래그 상태
  const state = useRef<DragState>({
    isDown: false,
    dragging: false,
    startX: 0,
    startY: 0,
    lastX: 0,
    width: 0,
    pointerId: null,
  });

  useEffect(() => {
    // 슬라이드 개수 변동 시 현재 인덱스로 스냅 (애니메이션 없이)
    snapToIndex(activeIndex, 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count]);

  useEffect(() => {
    if (!state.current.dragging) snapToIndex(activeIndex, 300);
  }, [activeIndex]);

  function onPointerDown(e: RPointerEvent<HTMLDivElement>) {
    // 마우스의 경우 좌클릭만 허용 (터치/펜은 button이 0으로 오므로 통과)
    if (e.button != null && e.button !== 0) return;
    const vp = viewportRef.current;
    state.current.isDown = true;
    state.current.dragging = false; // 아직 드래그 아님 (중요)
    state.current.startX = e.clientX;
    state.current.startY = e.clientY;
    state.current.lastX = e.clientX;
    state.current.width = vp?.clientWidth ?? 1;
    state.current.pointerId = e.pointerId ?? null;
    // 여기서는 capture / preventDefault 하지 않음 (클릭 합성 보존)
  }

  function onPointerMove(e: RPointerEvent<HTMLDivElement>) {
    if (!state.current.isDown) return;

    const dx = e.clientX - state.current.startX;
    const dy = e.clientY - state.current.startY;

    // 드래그 미확정 → 임계값 + 방향성 체크
    if (!state.current.dragging) {
      if (Math.abs(dx) > DRAG_ACTIVATE_PX && Math.abs(dx) > Math.abs(dy)) {
        state.current.dragging = true;
        // 드래그 확정 시점에만 캡처 & 기본동작 차단
        viewportRef.current?.setPointerCapture?.(state.current.pointerId as number);
        e.preventDefault();
        // 애니메이션 끔
        if (trackRef.current) {
          trackRef.current.style.transition = "none";
        }
      } else {
        return; // 아직 클릭 후보 상태 → 아무 것도 막지 않음
      }
    } else {
      // 이미 드래그 중이면 계속 기본동작 차단
      e.preventDefault();
    }

    // 드래그 처리
    state.current.lastX = e.clientX;
    const px = -activeIndex * (state.current.width || 1) + dx;
    if (trackRef.current) {
      trackRef.current.style.transform = `translate3d(${px}px,0,0)`;
    }
  }

  function onPointerUp(e: RPointerEvent<HTMLDivElement>) {
    if (!state.current.isDown) return;

    const wasDragging = state.current.dragging;
    const W = state.current.width || 1;
    const dx = state.current.lastX - state.current.startX;

    // 상태 리셋
    state.current.isDown = false;
    state.current.dragging = false;
    viewportRef.current?.releasePointerCapture?.(state.current.pointerId as number);

    if (!wasDragging) {
      // 드래그가 아니었으면 클릭 합성을 위해 아무 것도 막지 않음
      // (모달 등 카드 onClick 정상 동작)
      return;
    }

    // 드래그였으면 클릭 버블 방지 (의도치 않은 클릭 방지)
    e.preventDefault();
    e.stopPropagation();

    const threshold = Math.max(40, W * SWIPE_CHANGE_RATIO);
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

  function snapToIndex(i: number, ms: number = 260) {
    if (!trackRef.current || !viewportRef.current) return;
    const W = viewportRef.current.clientWidth || 0;
    trackRef.current.style.transition = ms ? `transform ${ms}ms ease` : "none";
    trackRef.current.style.transform = `translate3d(${-i * W}px,0,0)`;
  }

  // 좌/우 화살표 키보드로 cards 넘기기
  function onKeyDown(e: RKeyboardEvent<HTMLDivElement>) {
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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

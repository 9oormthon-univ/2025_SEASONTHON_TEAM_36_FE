import { useEffect, useRef, useState } from "react";

interface SwipeGestureOptions {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  minSwipeDistance?: number;
}

export const useSwipeGesture = ({
  onSwipeLeft,
  onSwipeRight,
  minSwipeDistance = 50,
}: SwipeGestureOptions) => {
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [swipeStatus, setSwipeStatus] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // 콜백을 ref로 저장하여 의존성 문제 해결
  const onSwipeLeftRef = useRef(onSwipeLeft);
  const onSwipeRightRef = useRef(onSwipeRight);

  useEffect(() => {
    onSwipeLeftRef.current = onSwipeLeft;
    onSwipeRightRef.current = onSwipeRight;
  }, [onSwipeLeft, onSwipeRight]);

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => setIsTransitioning(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isTransitioning]);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsDragging(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const currentTouch = e.targetTouches[0].clientX;
    setTouchEnd(currentTouch);
    const offset = currentTouch - touchStart;

    // 드래그 거리를 제한 (최대 100px)
    setDragOffset(Math.max(-100, Math.min(100, offset * 0.3)));
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      onSwipeLeftRef.current();
      setSwipeStatus(1);
    } else if (isRightSwipe) {
      onSwipeRightRef.current();
      setSwipeStatus(-1);
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  // 마우스 이벤트 (데스크톱 지원)
  const onMouseDown = (e: React.MouseEvent) => {
    // 차트 영역의 클릭은 무시
    const target = e.target as HTMLElement;
    if (target.closest("svg") || target.closest("canvas")) {
      return;
    }

    setTouchEnd(null);
    setTouchStart(e.clientX);
    setIsDragging(true);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (touchStart === null || !isDragging) return;
    const currentPos = e.clientX;
    setTouchEnd(currentPos);
    const offset = currentPos - touchStart;
    setDragOffset(Math.max(-100, Math.min(100, offset * 0.3)));
  };

  const onMouseUp = () => {
    if (!touchStart || !touchEnd) {
      setIsDragging(false);
      setDragOffset(0);
      setTouchStart(null);
      setTouchEnd(null);
      return;
    }

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      onSwipeLeftRef.current();
      setSwipeStatus(1);
    } else if (isRightSwipe) {
      onSwipeRightRef.current();
      setSwipeStatus(-1);
    }

    setIsDragging(false);
    setDragOffset(0);
    setTouchStart(null);
    setTouchEnd(null);
  };

  useEffect(() => {
    const handleMouseUpGlobal = () => {
      if (!touchStart || !touchEnd) {
        setIsDragging(false);
        setDragOffset(0);
        return;
      }

      const distance = touchStart - touchEnd;
      const isLeftSwipe = distance > minSwipeDistance;
      const isRightSwipe = distance < -minSwipeDistance;

      if (isLeftSwipe) {
        onSwipeLeftRef.current();
        setSwipeStatus(1);
      } else if (isRightSwipe) {
        onSwipeRightRef.current();
        setSwipeStatus(-1);
      }

      setIsDragging(false);
      setDragOffset(0);
      setTouchStart(null);
      setTouchEnd(null);
    };

    if (isDragging) {
      document.addEventListener("mouseup", handleMouseUpGlobal);
      return () => {
        document.removeEventListener("mouseup", handleMouseUpGlobal);
      };
    }
  }, [isDragging, touchStart, touchEnd, minSwipeDistance]);

  return {
    containerRef,
    swipeHandlers: {
      onTouchStart,
      onTouchMove,
      onTouchEnd,
      onMouseDown,
      onMouseMove,
      onMouseUp,
    },
    dragOffset,
    isDragging,
    isTransitioning,
    setIsTransitioning,
    swipeStatus,
    setSwipeStatus,
  };
};

// src/layout/BottomSheet/index.tsx
import { motion, type PanInfo, type Variants } from "framer-motion";
import React from "react";

import { useBottomSheetStore } from "@/pages/home/store/useBottomSheetStore";

import { Backdrop, GrabHandle, Panel, SheetViewport } from "./styles";

/** CSS 변수 타입 (style에 --peek 추가 용) */
type CSSVarProps = React.CSSProperties & { ["--peek"]?: string };

export default function BottomSheet({ children }: { children?: React.ReactNode }) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // ===== zustand store =====
  const open = useBottomSheetStore(s => s.open);
  const openSheet = useBottomSheetStore(s => s.openSheet);
  const closeSheet = useBottomSheetStore(s => s.closeSheet);
  const setHeight = useBottomSheetStore(s => s.setHeight);

  // 기본 구성값
  const size = useBottomSheetStore(s => s.defaultSize);
  const peekHeight = useBottomSheetStore(s => s.peekHeightPx);
  const ariaLabel = useBottomSheetStore(s => s.defaultAriaLabel);

  // ESC로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeSheet();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, closeSheet]);

  // body 스크롤 잠금
  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 초기 포커스
  React.useEffect(() => {
    if (!open || !panelRef.current) return;
    const t = window.setTimeout(() => panelRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  // 현재 높이 계산 → 스토어에 반영
  React.useEffect(() => {
    const vh = window.innerHeight;
    let px: number;

    if (open) {
      if (typeof size === "string" && size.endsWith("vh")) {
        const ratio = parseFloat(size) / 100;
        px = vh * ratio;
      } else {
        px = Number(size);
      }
    } else {
      px = peekHeight;
    }

    setHeight(px);
  }, [open, size, peekHeight, setHeight]);

  // 열림/피크 애니메이션
  const variants: Variants = {
    open: { y: 0, transition: { type: "spring", stiffness: 420, damping: 42 } },
    peek: {
      y: `calc(100% - ${peekHeight}px)`,
      transition: { type: "spring", stiffness: 420, damping: 42 },
    },
  };

  // 임계치: 열기/닫기 분리
  const THRESHOLD_OPEN = 6; // 위로 6px만 당겨도 열림
  const THRESHOLD_CLOSE = 80; // 아래로 80px 당기면 닫힘
  const FAST_VELOCITY = 800; // px/s (빠른 플릭)

  const handleOpen = () => openSheet();
  const handleClose = () => closeSheet();

  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y;
    const vy = info.velocity.y;

    if (open) {
      const dragDown = offsetY > THRESHOLD_CLOSE || vy > FAST_VELOCITY;
      if (dragDown) handleClose();
      return;
    }

    const dragUp = offsetY < -THRESHOLD_OPEN || vy < -FAST_VELOCITY;
    if (dragUp) handleOpen();
  };

  // Panel 스타일 컴포넌트가 `$size: string`을 기대한다면 숫자는 px 문자열로 변환
  const panelSize: string = typeof size === "number" ? `${size}px` : size;

  return (
    <>
      {open && (
        <Backdrop
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      <Panel
        ref={panelRef}
        as={motion.div}
        role="dialog"
        aria-modal={open ? "true" : undefined}
        aria-label={ariaLabel}
        tabIndex={open ? -1 : undefined}
        $size={panelSize}
        $open={open}
        variants={variants}
        initial="peek"
        animate={open ? "open" : "peek"}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        style={{ "--peek": `${peekHeight}px` } as CSSVarProps}
      >
        <GrabHandle
          role="button"
          tabIndex={0}
          aria-label={open ? "바텀시트 끌어서 닫기" : "바텀시트 끌어서 열기"}
          onClick={(e: React.MouseEvent<HTMLDivElement>) => {
            if (open) {
              handleClose();
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              if (open) {
                e.preventDefault();
                handleClose();
              } else {
                e.preventDefault();
              }
            }
          }}
          aria-hidden="false"
        >
          <span />
        </GrabHandle>

        <SheetViewport aria-hidden={!open}>{children}</SheetViewport>
      </Panel>
    </>
  );
}

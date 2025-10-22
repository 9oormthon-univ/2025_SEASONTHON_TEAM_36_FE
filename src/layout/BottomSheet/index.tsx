import { motion, type PanInfo, type Variants } from "framer-motion";
import React from "react";

import { Backdrop, GrabHandle, Panel, SheetViewport } from "./styles";

/** CSS 길이 유틸 타입 (필요 시 확장 가능) */
type CSSLength = `${number}px` | `${number}vh` | `${number}vw` | `${number}%`;

export interface BottomSheetProps {
  /** 열림 상태 */
  open: boolean;
  /** 드래그 업으로만 열기 (탭 불가) */
  onOpen?: () => void;
  /** 닫기 콜백 */
  onClose: () => void;
  /** 패널 높이 (예: "56vh" | 420) */
  size?: number | CSSLength;
  /** 피크(닫힘) 높이 px */
  peekHeight?: number;
  /** 현재 차지하는 높이(px) 변경 알림 */
  onHeightChange?: (px: number) => void;
  /** 접근성 레이블 */
  ariaLabel?: string;
  /** 내용 */
  children?: React.ReactNode;
}

/** CSS 변수 타입 (style에 --peek 추가 용) */
type CSSVarProps = React.CSSProperties & { ["--peek"]?: string };

export default function BottomSheet({
  open,
  onOpen,
  onClose,
  size = "56vh",
  peekHeight = 28,
  onHeightChange,
  ariaLabel = "bottom drawer",
  children,
}: BottomSheetProps) {
  const panelRef = React.useRef<HTMLDivElement>(null);

  // ESC로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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

  // 부모로 현재 높이 전달
  React.useEffect(() => {
    if (!onHeightChange) return;

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

    onHeightChange(px);
  }, [open, size, peekHeight, onHeightChange]);

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

  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y; // 위로 당기면 음수
    const vy = info.velocity.y; // 위로 플릭하면 음수

    if (open) {
      const dragDown = offsetY > THRESHOLD_CLOSE || vy > FAST_VELOCITY;
      if (dragDown) onClose?.();
      return;
    }

    const dragUp = offsetY < -THRESHOLD_OPEN || vy < -FAST_VELOCITY;
    if (dragUp) onOpen?.();
  };

  // Panel 스타일 컴포넌트가 `$size: string`을 기대한다면 숫자는 px 문자열로 변환
  const panelSize: string = typeof size === "number" ? `${size}px` : size;

  return (
    <>
      {/* Backdrop */}
      {open && (
        <Backdrop
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          onClick={onClose}
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
              onClose?.();
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onKeyDown={(e: React.KeyboardEvent<HTMLDivElement>) => {
            if (e.key === "Enter" || e.key === " ") {
              if (open) {
                e.preventDefault();
                onClose?.();
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

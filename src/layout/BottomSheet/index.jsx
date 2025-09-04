import React from "react";
import { motion } from "framer-motion";
import { Backdrop, Panel, GrabHandle, SheetViewport } from "./styles";

/** Bottom-only Drawer (BottomSheet)
 * props:
 *  - open: boolean
 *  - onOpen?: () => void // 드래그 업으로만 열기 (탭 불가)
 *  - onClose: () => void
 *  - size: number | string (default: "56vh")
 *  - peekHeight: number (default: 28)
 *  - onHeightChange?: (px: number) => void   // 현재 차지하는 높이 전달
 *  - ariaLabel?: string
 *  - children: ReactNode
 * 특징:
 *  - ESC/Backdrop 닫기
 *  - body 스크롤 잠금(열렸을 때)
 *  - 드래그 업으로 열기 / 드래그 다운으로 닫기(임계치 분리)
 *  - 닫힘(peek) 상태에서는 내용 상호작용 차단(그랩핸들만 허용)
 *  - 닫힘 상태에서 탭으로 열리지 않음(드래그만 허용)
 */
export default function BottomSheet({
  open,
  onOpen,
  onClose,
  size = "56vh",
  peekHeight = 28,
  onHeightChange,
  ariaLabel = "bottom drawer",
  children,
}) {
  const panelRef = React.useRef(null);

  // ESC로 닫기
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
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
    const t = setTimeout(() => panelRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open]);

  // 부모로 현재 높이 전달
  React.useEffect(() => {
    if (!onHeightChange) return;

    const vh = window.innerHeight;
    let px;

    if (open) {
      // size가 "56vh" 같은 비율 문자열일 수도 있음
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
  const variants = {
    open: { y: 0, transition: { type: "spring", stiffness: 420, damping: 42 } },
    peek: {
      y: `calc(100% - ${peekHeight}px)`,
      transition: { type: "spring", stiffness: 420, damping: 42 },
    },
  };

  // 임계치: 열기/닫기 분리
  const THRESHOLD_OPEN = 6;      // 위로 6px만 당겨도 열림
  const THRESHOLD_CLOSE = 80;    // 아래로 80px 당기면 닫힘
  const FAST_VELOCITY = 800;     // px/s (빠른 플릭)

  const onDragEnd = (_e, info) => {
    const offsetY = info.offset.y;   // 위로 당기면 음수
    const vy = info.velocity.y;      // 위로 플릭하면 음수

    if (open) {
      const dragDown = offsetY > THRESHOLD_CLOSE || vy > FAST_VELOCITY;
      if (dragDown) onClose?.();
      return;
    }

    const dragUp = offsetY < -THRESHOLD_OPEN || vy < -FAST_VELOCITY;
    if (dragUp) onOpen?.();
  };

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
        $size={size}
        $open={open}
        variants={variants}
        initial="peek"
        animate={open ? "open" : "peek"}
        drag="y"
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={0.06}
        dragMomentum={false}
        onDragEnd={onDragEnd}
        style={{ "--peek": `${peekHeight}px` }}
      >
        <GrabHandle
          role="button"
          tabIndex={0}
          aria-label={open ? "바텀시트 끌어서 닫기" : "바텀시트 끌어서 열기"}
          onClick={(e) => {
            if (open) {
              onClose?.();
            } else {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          onKeyDown={(e) => {
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

import React from "react";
import { motion } from "framer-motion";
import { Backdrop, Panel, GrabHandle, SheetViewport } from "./styles";

/** Bottom-only Drawer (BottomSheet)
 * props:
 *  - open: boolean
 *  - onOpen?: () => void       // 드래그 업으로만 열기 (탭 불가)
 *  - onClose: () => void
 *  - size: number | string (default: "56vh")
 *  - peekHeight: number (default: 28)
 *  - ariaLabel?: string
 *  - children: ReactNode
 *
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
      // 열려있을 때: 충분히 아래로 끌거나 빠르게 아래로 플릭하면 닫기
      const dragDown =
        offsetY > THRESHOLD_CLOSE || vy > FAST_VELOCITY;
      if (dragDown) onClose?.();
      return;
    }

    // 닫혀있을 때: 살짝이라도 위로 끌거나 빠르게 위로 플릭하면 열기
    const dragUp =
      offsetY < -THRESHOLD_OPEN || vy < -FAST_VELOCITY;
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

      {/* 패널: 닫힘 상태에는 peek만 보임 */}
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
          aria-label={
            open ? "바텀시트 끌어서 닫기" : "바텀시트 끌어서 열기"
          }
          // 닫힘 상태에서는 탭/엔터/스페이스로 '열기' 금지 (드래그만 허용)
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
                // 닫힘 상태에서는 키로 열지 않음 (드래그만)
                e.preventDefault();
              }
            }
          }}
          aria-hidden="false"
        >
          <span />
        </GrabHandle>

        {/* 닫힘(peek) 상태에서는 내용 클릭/스크롤 불가 */}
        <SheetViewport aria-hidden={!open}>{children}</SheetViewport>
      </Panel>
    </>
  );
}

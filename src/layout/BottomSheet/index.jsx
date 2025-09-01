import React from "react";
import { motion } from "framer-motion";
import { Backdrop, Panel, GrabHandle, SheetViewport } from "./styles";

/** Bottom-only Drawer (BottomSheet)
 * props:
 *  - open: boolean
 *  - onOpen?: () => void       // 드래그 업/탭으로 열기
 *  - onClose: () => void
 *  - size: number | string (default: "56vh")
 *  - peekHeight: number (default: 28)   // 닫힘 상태에서 항상 보일 높이
 *  - ariaLabel?: string
 *  - children: ReactNode
 *
 * 특징:
 *  - ESC/Backdrop 닫기
 *  - body 스크롤 잠금(열렸을 때)
 *  - 드래그 업으로 열기 / 드래그 다운으로 닫기(임계치 포함)
 *  - 닫힘(peek) 상태에서는 내용 상호작용 차단(그랩핸들만 허용)
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
    return () => { document.body.style.overflow = prev; };
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

  const THRESHOLD = 80;       // px
  const FAST_VELOCITY = 800;  // px/s

  const onDragEnd = (_e, info) => {
    const dragDown = info.offset.y > THRESHOLD || info.velocity.y > FAST_VELOCITY;
    const dragUp   = info.offset.y < -THRESHOLD || info.velocity.y < -FAST_VELOCITY;

    if (open && dragDown) onClose?.();
    if (!open && dragUp) onOpen?.();
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
          aria-label={open ? "바텀시트 끌어서 닫기" : "바텀시트 끌어서 열기"}
          onClick={() => (open ? onClose?.() : onOpen?.())}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open ? onClose?.() : onOpen?.();
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

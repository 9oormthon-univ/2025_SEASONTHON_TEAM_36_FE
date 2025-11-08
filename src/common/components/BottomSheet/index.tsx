// src/layout/BottomSheet/index.tsx
import { motion, type PanInfo, type Variants } from "framer-motion";
import { ReactNode, useCallback, useEffect, useRef } from "react";
import { CSSProperties } from "styled-components";

import { useBottomSheetStore } from "@/pages/home/store/useBottomSheetStore";

import { Backdrop, GrabHandle, Panel, SheetViewport } from "./styles";

/** CSS 변수 타입 (style에 --peek 추가 용) */
type CSSVarProps = CSSProperties & { ["--peek"]?: string };

export default function BottomSheet({ children }: { children?: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ===== zustand store =====
  const open = useBottomSheetStore(s => s.open);
  const isExpanded = useBottomSheetStore(s => s.isExpanded);
  const openSheet = useBottomSheetStore(s => s.openSheet);
  const closeSheet = useBottomSheetStore(s => s.closeSheet);
  const expandSheet = useBottomSheetStore(s => s.expandSheet);
  const collapseSheet = useBottomSheetStore(s => s.collapseSheet);
  const setHeight = useBottomSheetStore(s => s.setHeight);

  const size = useBottomSheetStore(s => s.defaultSize); // ← 32vh
  const expandedSize = useBottomSheetStore(s => s.expandedSize); // ← 58vh (store)
  const peekHeight = useBottomSheetStore(s => s.peekHeightPx);
  const ariaLabel = useBottomSheetStore(s => s.defaultAriaLabel);

  // ESC로 닫기/접기
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isExpanded) collapseSheet();
        else closeSheet();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, isExpanded, collapseSheet, closeSheet]);

  // body 스크롤 잠금
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // 초기 포커스
  useEffect(() => {
    if (!open || !panelRef.current) return;
    const t = window.setTimeout(() => panelRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open]);

  // 유틸: CSSLength/number → px
  const toPx = useCallback((len: number | `${number}${string}`, vh: number) => {
    if (typeof len === "number") return len;
    if (len.endsWith("vh")) return (parseFloat(len) / 100) * vh;
    if (len.endsWith("vw")) return (parseFloat(len) / 100) * window.innerWidth;
    if (len.endsWith("%")) return (parseFloat(len) / 100) * vh; // 대략적으로 vh 기준
    if (len.endsWith("px")) return parseFloat(len);
    const num = Number(len);
    return Number.isFinite(num) ? num : 0;
  }, []);

  // 현재 높이 계산 → 스토어에 반영
  useEffect(() => {
    const vh = window.innerHeight;
    let px: number;

    if (!open) {
      // 피크
      px = peekHeight;
    } else if (isExpanded) {
      // 확장: store.expandedSize
      px = toPx(expandedSize, vh);
    } else {
      // 열림: defaultSize
      px = toPx(size, vh);
    }

    setHeight(px);
  }, [open, isExpanded, size, expandedSize, peekHeight, setHeight, toPx]);

  // 상태별 애니메이션
  const variants: Variants = {
    expanded: { y: 0, transition: { type: "spring", stiffness: 420, damping: 42 } },
    open: { y: 0, transition: { type: "spring", stiffness: 420, damping: 42 } },
    peek: {
      y: `calc(100% - ${peekHeight}px)`,
      transition: { type: "spring", stiffness: 420, damping: 42 },
    },
  };

  // 드래그 임계치
  const THRESHOLD_OPEN_UP = 0; // 피크 → 열림
  const THRESHOLD_EXPAND_UP = 60; // 열림 → 확장
  const THRESHOLD_COLLAPSE_DOWN = 40; // 확장 → 열림
  const THRESHOLD_CLOSE_DOWN = 120; // 열림/확장 → 피크
  const FAST_VELOCITY = 800; // px/s

  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y; // 위 음수 / 아래 양수
    const vy = info.velocity.y;

    if (!open) {
      // 피크 상태: 위로 끌면 열림
      const dragUpToOpen = offsetY < -THRESHOLD_OPEN_UP || vy < -FAST_VELOCITY;
      if (dragUpToOpen) openSheet();
      return;
    }

    if (isExpanded) {
      // 확장
      const quickClose = offsetY > THRESHOLD_CLOSE_DOWN || vy > FAST_VELOCITY;
      const collapse = offsetY > THRESHOLD_COLLAPSE_DOWN || vy > FAST_VELOCITY / 2;
      if (quickClose)
        closeSheet(); // 바로 피크
      else if (collapse) collapseSheet(); // 열림으로
      return;
    }

    // 열림
    const closeDown = offsetY > THRESHOLD_CLOSE_DOWN || vy > FAST_VELOCITY;
    const expandUp = offsetY < -THRESHOLD_EXPAND_UP || vy < -FAST_VELOCITY;
    if (closeDown)
      closeSheet(); // 피크
    else if (expandUp) expandSheet(); // 확장
  };

  // 패널 사이즈: 확장=expandedSize, 열림=defaultSize
  const panelSize: string = isExpanded
    ? typeof expandedSize === "number"
      ? `${expandedSize}px`
      : (expandedSize as string)
    : typeof size === "number"
      ? `${size}px`
      : (size as string);

  return (
    <>
      {open && (
        <Backdrop
          as={motion.div}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.12 } }}
          exit={{ opacity: 0, transition: { duration: 0.12 } }}
          onClick={() => {
            if (isExpanded) collapseSheet();
            else closeSheet();
          }}
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
        animate={!open ? "peek" : isExpanded ? "expanded" : "open"}
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
          aria-label={
            !open
              ? "바텀시트 끌어서 열기"
              : isExpanded
                ? "바텀시트 끌어서 접기"
                : "바텀시트 끌어서 닫기 또는 확장"
          }
          onClick={e => {
            if (!open) {
              e.preventDefault();
              e.stopPropagation();
              openSheet();
              return;
            }
            if (isExpanded) {
              collapseSheet();
            } else {
              closeSheet();
            }
          }}
          onKeyDown={e => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              if (!open) openSheet();
              else if (isExpanded) collapseSheet();
              else closeSheet();
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

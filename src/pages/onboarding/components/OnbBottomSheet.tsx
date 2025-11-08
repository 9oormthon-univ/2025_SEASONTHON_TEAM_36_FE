import { motion, type PanInfo } from "framer-motion";
import { type CSSProperties, ReactNode, useCallback, useEffect, useMemo, useRef } from "react";
import styled from "styled-components";

import { useBottomSheetStore } from "@/pages/home/store/useBottomSheetStore";

/** CSS 변수 타입 (style에 --peek 추가 용) */
type CSSVarProps = CSSProperties & { ["--peek"]?: string };

export default function OnbBottomSheet({ children }: { children?: ReactNode }) {
  const panelRef = useRef<HTMLDivElement>(null);

  // ===== zustand store =====
  const open = useBottomSheetStore(s => s.open);
  const isExpanded = useBottomSheetStore(s => s.isExpanded);
  const openSheet = useBottomSheetStore(s => s.openSheet);
  const closeSheet = useBottomSheetStore(s => s.closeSheet);
  const expandSheet = useBottomSheetStore(s => s.expandSheet);
  const collapseSheet = useBottomSheetStore(s => s.collapseSheet);
  const setHeight = useBottomSheetStore(s => s.setHeight);
  const heightPx = useBottomSheetStore(s => s.heightPx);

  // 온보딩에선 %도 쓸 수 있게 허용 (부모 높이 필요). px 환산은 뷰포트 기준 간이 처리.
  const size = 150; // 예: "32vh" | "32%" | 320
  const expandedSize = 300; // 예: "58vh" | "58%" | 580
  const peekHeight = 40;
  const ariaLabel = useBottomSheetStore(s => s.defaultAriaLabel);

  // 유틸: CSSLength/number → px (vh/% 등 대응, %는 뷰포트 기준 간이 환산)
  const toPx = useCallback((len: number | `${number}${string}`, vh: number) => {
    if (typeof len === "number") return len;
    if (len.endsWith("vh")) return (parseFloat(len) / 100) * vh;
    if (len.endsWith("vw")) return (parseFloat(len) / 100) * window.innerWidth;
    if (len.endsWith("%")) return (parseFloat(len) / 100) * vh; // 부모기준 필요하면 확장
    if (len.endsWith("px")) return parseFloat(len);
    const num = Number(len);
    return Number.isFinite(num) ? num : 0;
  }, []);

  // 현재 높이 계산 → 스토어에 반영 (드래그 임계치/내부 레이아웃에서 사용)
  useEffect(() => {
    const vh = window.innerHeight;
    let px: number;

    if (!open) {
      px = peekHeight;
    } else if (isExpanded) {
      px = toPx(expandedSize, vh);
    } else {
      px = toPx(size, vh);
    }

    setHeight(px);
  }, [open, isExpanded, size, expandedSize, peekHeight, setHeight, toPx]);

  const yPeek = useMemo(() => Math.max((heightPx || 0) - peekHeight, 0), [heightPx, peekHeight]);

  // 상태별 애니메이션 (필요 시 variants 사용)
  const variants = useMemo(
    () => ({
      expanded: { y: 0, transition: { type: "spring", stiffness: 420, damping: 42 } },
      open: { y: 0, transition: { type: "spring", stiffness: 420, damping: 42 } },
      peek: { y: yPeek, transition: { type: "spring", stiffness: 420, damping: 42 } },
    }),
    [yPeek],
  );

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
      const dragUpToOpen = offsetY < -THRESHOLD_OPEN_UP || vy < -FAST_VELOCITY;
      if (dragUpToOpen) openSheet();
      return;
    }

    if (isExpanded) {
      const quickClose = offsetY > THRESHOLD_CLOSE_DOWN || vy > FAST_VELOCITY;
      const collapse = offsetY > THRESHOLD_COLLAPSE_DOWN || vy > FAST_VELOCITY / 2;
      if (quickClose) closeSheet();
      else if (collapse) collapseSheet();
      return;
    }

    const closeDown = offsetY > THRESHOLD_CLOSE_DOWN || vy > FAST_VELOCITY;
    const expandUp = offsetY < -THRESHOLD_EXPAND_UP || vy < -FAST_VELOCITY;
    if (closeDown) closeSheet();
    else if (expandUp) expandSheet();
  };

  // CSS height 값 그대로 사용 (부모 높이 기준으로 %도 가능)
  const panelSize: string = isExpanded
    ? typeof expandedSize === "number"
      ? `${expandedSize}px`
      : (expandedSize as string)
    : typeof size === "number"
      ? `${size}px`
      : (size as string);

  return (
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
  );
}

/** Props 타입 정의 */
interface PanelProps {
  /** 패널 높이 (예: "50vh", "80%" 등) */
  $size: string;
  /** 오픈 여부: true일 때만 클릭 가능 */
  $open: boolean;
}

/** Backdrop: 네비 영역은 가리지 않음 */
export const Backdrop = styled.div`
  position: fixed;
  inset: 0 0 var(--navbar-height, 0px) 0;
  z-index: 900;
`;

/** Panel: 네비바에 정확히 맞닿도록 보더 보정 */
export const Panel = styled(motion.div)<PanelProps>`
  position: absolute;
  z-index: 10;
  left: 0;
  bottom: 0;
  width: 100%;
  height: ${({ $size }) => $size};
  background: var(--bg-1, #fff);
  color: var(--text-1, #101014);
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
  outline: none;
  border-radius: 24px 24px 0 0;
  display: flex;
  flex-direction: column;
  pointer-events: auto;
  will-change: transform;
`;

export const GrabHandle = styled.div`
  position: absolute;
  z-index: 100;
  inset: 0 0 auto 0;
  height: 56px;
  display: grid;
  place-items: center;
  cursor: grab;
  background: transparent;

  &:active {
    cursor: grabbing;
  }
`;

export const SheetViewport = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  padding: 4px 0 0 0;
`;

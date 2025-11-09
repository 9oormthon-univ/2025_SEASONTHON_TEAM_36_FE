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

  // 상단에 추가
  const lockedScrollYRef = useRef<number | null>(null);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!open) return;

    const scrollY = window.scrollY || window.pageYOffset;
    lockedScrollYRef.current = scrollY; // ✅ 실제 잠금 시점 저장

    const prev = {
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
    };

    html.style.overscrollBehavior = "none";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden";
    html.classList.add("sheet-open");

    return () => {
      html.style.overscrollBehavior = prev.htmlOverscrollBehavior;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      html.classList.remove("sheet-open");

      // ✅ 잠금 당시의 scrollY로 복원
      const lockedY = lockedScrollYRef.current ?? 0;
      lockedScrollYRef.current = null;
      window.scrollTo(0, lockedY);
    };
  }, [open]);

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
  // 🔒 뒤 화면 스크롤 완전 차단 (iOS Safari 대응: body 고정 + 스크롤 복원)
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (!open) return;

    // 현재 스크롤 위치 저장
    const scrollY = window.scrollY || window.pageYOffset;

    // 기존 인라인 스타일 백업
    const prev = {
      htmlOverscrollBehavior: html.style.overscrollBehavior,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
      bodyOverflow: body.style.overflow,
    };

    // 스크롤 잠금 (iOS 포함)
    html.style.overscrollBehavior = "none"; // Android/Chrome 계열 보정
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    body.style.overflow = "hidden"; // 안전망

    // 클래스 플래그(원하면 전역 CSS에서 활용 가능)
    html.classList.add("sheet-open");

    return () => {
      // 원복
      html.style.overscrollBehavior = prev.htmlOverscrollBehavior;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      body.style.overflow = prev.bodyOverflow;
      html.classList.remove("sheet-open");

      // 스크롤 위치 복원
      const y = Math.abs(parseInt(prev.bodyTop || "0", 10)) || scrollY;
      window.scrollTo(0, y);
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
  const THRESHOLD_OPEN_UP = 12; // 피크 → 열림
  const THRESHOLD_EXPAND_UP = 80; // 열림 → 확장
  const THRESHOLD_COLLAPSE_DOWN = 64; // 확장 → 열림
  const THRESHOLD_CLOSE_DOWN = 86; // 열림/확장 → 피크
  const FAST_VELOCITY = 1400; // px/s
  const VERY_FAST_VELOCITY = 2200; // 강제 닫힘/열림 트리거

  const strongUp = (offsetY: number, vy: number, dist = THRESHOLD_EXPAND_UP) =>
    offsetY < -dist || vy < -FAST_VELOCITY;

  const strongDown = (offsetY: number, vy: number, dist = THRESHOLD_CLOSE_DOWN) =>
    offsetY > dist || vy > FAST_VELOCITY;

  const veryFastDown = (vy: number) => vy > VERY_FAST_VELOCITY;
  const veryFastUp = (vy: number) => vy < -VERY_FAST_VELOCITY;

  const onDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    const offsetY = info.offset.y; // 위 음수 / 아래 양수
    const vy = info.velocity.y;

    // 1) 피크 → 위로 끌면 열림
    if (!open) {
      if (strongUp(offsetY, vy, THRESHOLD_OPEN_UP) || veryFastUp(vy)) openSheet();
      return;
    }

    // 2) 확장 상태
    if (isExpanded) {
      // 닫힘 우선(아주 강한 아래 드래그)
      if (veryFastDown(vy)) {
        closeSheet();
        return;
      }

      // 일반적 아래 드래그면 열림으로 축소
      if (strongDown(offsetY, vy, THRESHOLD_COLLAPSE_DOWN)) {
        collapseSheet();
        return;
      }

      // 위로 강하게 당기면(거의 없음) 유지
      return;
    }

    // 3) 열림 상태
    // 아주 강한 아래 드래그는 닫힘(피크)
    if (veryFastDown(vy)) {
      closeSheet();
      return;
    }

    // 아래로 충분하면 닫힘
    if (strongDown(offsetY, vy, THRESHOLD_CLOSE_DOWN)) {
      closeSheet();
      return;
    }

    // 위로 충분하면 확장
    if (strongUp(offsetY, vy, THRESHOLD_EXPAND_UP) || veryFastUp(vy)) {
      expandSheet();
      return;
    }

    // 그 외에는 유지
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

// src/pages/home/onboarding/layout/OnbLayout.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { keyframes } from "styled-components";

import bigSiren from "@/assets/images/big-siren.svg";

import type { OnbStage } from "../engine/stages";

/** ===== 하이라이트 스팟 타입 ===== */
export type HighlightSpot = {
  rect: DOMRect; // window 기준 좌표(getBoundingClientRect)
  radius?: number; // 둥근 모서리/원 강조용
  dotted?: boolean; // 점선 링 표시 여부
  bubbleText?: string; // 말풍선 텍스트
};

export type SceneProps = {
  stage: OnbStage;
  /** window 좌표 기준(getBoundingClientRect) */
  setSpotRect: (r: DOMRect | null) => void;
  /** 여러 스팟을 Layout에 보고 (window 좌표 기준) */
  setOverlaySpots?: (spots: HighlightSpot[]) => void;
};

export interface OnbLayoutProps {
  sceneMap: Record<string, React.ComponentType<SceneProps>>;
  stages: OnbStage[];
  activeIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSkip?: () => void; // (남겨두되 버튼은 제거)
}

export default function OnbLayout({
  sceneMap,
  stages,
  activeIndex: extIndex,
  onPrev,
  onNext,
  onSkip,
}: OnbLayoutProps) {
  /** 단일 spotRect(기존 기능 유지: 특정 컴포넌트 포커싱) */
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);

  /** Scene이 보고한 다중 스팟(전역 오버레이로 렌더) */
  const [overlaySpots, setOverlaySpots] = useState<HighlightSpot[]>([]);

  /** 프레임 참조(spotRect를 프레임 로컬로 변환) */
  const frameRef = useRef<HTMLDivElement>(null);

  /** 포털 컨테이너(body 하단에 동적 생성) */
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("id", "onb-portal");
    el.style.position = "relative";
    el.style.zIndex = "2147483647"; // 최상단
    document.body.appendChild(el);
    setPortalEl(el);

    // 온보딩 동안 스크롤 잠금
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeChild(el);
    };
  }, []);

  const activeIndex = useMemo(() => extIndex ?? 0, [extIndex]);
  const stage = stages[activeIndex] ?? null;
  const showBigSiren = stage?.componentKey === "big-siren";

  /** 스테이지 변경 시 기존 단일 spot 초기화 */
  useEffect(() => setSpotRect(null), [stage?.id]);
  useEffect(() => {
    // stage 전환 시 기존 오버레이 즉시 제거
    setOverlaySpots([]);
  }, [stage?.id, stage?.componentKey]);

  /** 단일 spotRect를 프레임 로컬 좌표로 변환하여 프레임 위에 렌더 */
  const localSpot = useMemo(() => {
    if (!spotRect || !frameRef.current) return null;
    const fr = frameRef.current.getBoundingClientRect();
    return new DOMRect(spotRect.x - fr.x, spotRect.y - fr.y, spotRect.width, spotRect.height);
  }, [spotRect]);

  /** 키보드 네비게이션 */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onSkip]);

  /** 인터랙션 한 번만 다음으로 진행 */
  const didAdvanceRef = useRef(false);
  useEffect(() => {
    didAdvanceRef.current = false; // 스테이지 진입마다 리셋
  }, [stage?.id]);

  const canAdvance = true; // stage.footer?.nextEnabled 없으면 true

  const advanceNextIfAllowed = useCallback(() => {
    if (didAdvanceRef.current) return;
    if (!canAdvance) return;
    didAdvanceRef.current = true;
    onNext?.();
  }, [canAdvance, onNext]);

  if (!stage || !portalEl) return null;
  const Scene = stage.sceneKey ? sceneMap[stage.sceneKey] : undefined;

  /** 특정 요소는 진행 제외: data-onb-no-advance="true" */
  const shouldIgnoreTarget = (el: EventTarget | null) => {
    let n = el as HTMLElement | null;
    while (n) {
      if (n.getAttribute && n.getAttribute("data-onb-no-advance") === "true") return true;
      n = n.parentElement;
    }
    return false;
  };

  /** 루트 배경(프레임 바깥) 클릭으로 좌/우 반 화면 네비게이션 */
  const handleRootClick = (e: React.MouseEvent) => {
    const x = e.clientX;
    const mid = window.innerWidth / 2;
    if (x < mid) onPrev?.();
    else advanceNextIfAllowed();
  };

  /** 프레임 내부 인터랙션 -> 다음 진행 */
  const onFramePointerDown = (e: React.PointerEvent) => {
    if (shouldIgnoreTarget(e.target)) return;
    advanceNextIfAllowed();
  };
  const onFrameKeyDown = (e: React.KeyboardEvent) => {
    if (shouldIgnoreTarget(e.target)) return;
    if (e.key === "Enter" || e.key === " ") advanceNextIfAllowed();
  };
  const onFrameInput = (e: React.FormEvent) => {
    if (shouldIgnoreTarget(e.target)) return;
    advanceNextIfAllowed();
  };
  const onFrameWheel = (e: React.WheelEvent) => {
    if (shouldIgnoreTarget(e.target)) return;
    advanceNextIfAllowed();
  };

  /** ===== 최종 렌더(Portal) ===== */
  return createPortal(
    <Root $transparentBg={showBigSiren || stage.id === "end"} onClick={handleRootClick}>
      {stage.id === "end" && <DimOverlay />}
      {/* === 프레임 (앱 미리보기 캔버스) === */}
      {/* === 프레임 (앱 미리보기 캔버스) === */}
      {stage.id !== "end" && (
        <FrameWrap>
          <Frame
            ref={frameRef}
            aria-label="Onboarding Frame"
            onClick={e => e.stopPropagation()}
            onPointerDown={onFramePointerDown}
            onKeyDown={onFrameKeyDown}
            onInput={onFrameInput}
            onWheel={onFrameWheel}
            tabIndex={-1}
          >
            {Scene ? (
              <Scene
                key={stage.id}
                stage={stage}
                setSpotRect={setSpotRect}
                setOverlaySpots={setOverlaySpots}
              />
            ) : (
              <FramePlaceholder>sceneKey가 없습니다.</FramePlaceholder>
            )}

            {/* 프레임 내부 오버레이(로컬 스팟) */}
            <FrameOverlay>
              {localSpot && (
                <SpotDimLocal
                  $rect={localSpot}
                  $radius={stage.componentKey === "goal-card" ? 12 : 9999}
                />
              )}
              {stage.pulse && localSpot ? <Pulse $rect={localSpot} /> : null}

              {stage.componentKey === "chatbot" && localSpot ? (
                <>
                  <DottedCircleLocal $rect={localSpot} />
                  <SpotBubbleLocal $rect={localSpot}>AI 개구리 ‘Rana’</SpotBubbleLocal>
                </>
              ) : null}
            </FrameOverlay>

            {/* 빅 사이렌 모드 */}
            {showBigSiren && (
              <>
                <DimOverlay />
                <CenterSiren role="img" aria-label="긴급 경고 사이렌">
                  <img src={bigSiren} alt="" />
                </CenterSiren>
              </>
            )}
          </Frame>
        </FrameWrap>
      )}
      {(showBigSiren || stage.id === "end") && <HintSpacer />}
      {/* 하단 힌트 텍스트(앱 UI 위) */}
      <HintText
        className="typo-h4"
        $centered={showBigSiren || stage.id === "end"}
        $isSiren={showBigSiren}
      >
        {stage.body}
      </HintText>

      {/* === 전역 다중 스팟 오버레이(윈도우 고정 좌표) === */}
      <OverlayLayer aria-hidden>
        {overlaySpots.map((s, i) => (
          <React.Fragment key={i}>
            <SpotDimFixed $rect={s.rect} $radius={s.radius} />
            {s.dotted && <DottedCircleFixed $rect={s.rect} />}
            {s.bubbleText ? <SpotBubbleFixed $rect={s.rect}>{s.bubbleText}</SpotBubbleFixed> : null}
          </React.Fragment>
        ))}
      </OverlayLayer>
    </Root>,
    portalEl,
  );
}

/* ================= styles ================= */

const Root = styled.div<{ $transparentBg?: boolean }>`
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  background: ${p => (p.$transparentBg ? "transparent" : "rgba(17, 24, 39, 0.85)")};
  backdrop-filter: ${p => (p.$transparentBg ? "none" : "blur(2px)")};
  cursor: pointer; /* 화면 배경 클릭 네비 */
`;

const FrameWrap = styled.div`
  display: grid;
  place-items: center;
  padding: 40px 0 12px;
`;

const Frame = styled.div`
  position: relative;
  width: min(420px, 80vw);
  height: min(800px, 70vh);
  background: #ffffff;
  border-radius: 28px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    0 0 0 2px rgba(0, 0, 0, 0.06) inset;
  overflow: hidden;
  outline: none;
  cursor: default;
  margin-top: auto;
`;

const FrameOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
`;

const FramePlaceholder = styled.div`
  padding: 32px;
  color: #94a3b8;
`;

/* 하단 힌트 텍스트 */
const HintText = styled.div<{ $centered?: boolean; $isSiren?: boolean }>`
  background: transparent;
  color: var(--text-w1, #fff);
  border: none;
  padding: 12px;
  text-align: center;
  word-break: keep-all;
  white-space: pre-line;
  z-index: 50;
  position: ${p => (p.$centered ? "fixed" : "relative")};
  left: 0;
  right: 0;

  /* 일반 상태: 화면 하단 근처 */
  height: ${p => (p.$centered ? "auto" : "10vh")};
  margin-bottom: ${p => (p.$centered ? "0" : "7vh")};
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* 중앙 또는 약간 아래 정렬 */
  top: ${p =>
    p.$centered
      ? p.$isSiren
        ? "65%" // 사이렌 있을 때 글씨 살짝 아래로
        : "50%" // 일반 end 상태는 정확히 중앙
      : "auto"};
  transform: ${p => (p.$centered ? "translateY(-50%)" : "none")};
`;
/* 하단 공간 보존용 스페이서 */
const HintSpacer = styled.div`
  /* 일반 하단 힌트의 height(10vh) + margin-bottom(7vh) = 17vh */
  height: 17vh;
  /* grid row #2를 차지하도록 기본 흐름에 두면 됩니다 */
`;
/* 프레임 내부 하이라이트(펄스) */
const pulseKey = keyframes`
  0% { opacity: .6; transform: scale(.98); }
  60% { opacity: .15; transform: scale(1.04); }
  100% { opacity: 0; transform: scale(1.08); }
`;
const Pulse = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x - 6}px;
  top: ${p => p.$rect.y - 6}px;
  width: ${p => p.$rect.width + 12}px;
  height: ${p => p.$rect.height + 12}px;
  border-radius: 14px;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.9);
  pointer-events: none;
  &:after {
    content: "";
    position: absolute;
    inset: -8px;
    border-radius: 18px;
    border: 3px solid rgba(59, 130, 246, 0.7);
    animation: ${pulseKey} 1.5s ease-out infinite;
  }
`;

/* ========== 프레임 "로컬" 스팟들 ========== */
const DottedCircleLocal = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x - 2}px;
  top: ${p => p.$rect.y - 2}px;
  width: ${p => p.$rect.width + 4}px;
  height: ${p => p.$rect.height + 4}px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  pointer-events: none;
  z-index: 10;
`;

const SpotBubbleLocal = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x + p.$rect.width / 2 - 68}px;
  top: ${p => p.$rect.y + p.$rect.height + 12}px; /* 요소 아래 */
  transform: translateX(-50%);
  width: 140px;
  max-width: 240px;
  background: var(--green-100);
  color: var(--text-1);
  border-radius: 23px 0 23px 23px;
  padding: 12px 16px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  pointer-events: none;
  z-index: 10;
`;

const SpotDimLocal = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: absolute;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : "14px")};
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.45);
  pointer-events: none;
  transition:
    left 0.06s linear,
    top 0.06s linear,
    width 0.06s linear,
    height 0.06s linear;
  z-index: 5;
`;

/** 화면 전체 디밍: 모바일 화면 전체 덮기 (root의 background는 설정하지 않음) */
const DimOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 7;
  pointer-events: none;
`;

/** 사이렌 펄스 */
const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.95; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

/** 중앙 고정 사이렌 */
const CenterSiren = styled.figure`
  position: fixed;
  left: 39%;
  top: 45%; /* 기존 50% → 살짝 위로 이동 */
  width: min(28vw, 320px);
  z-index: 9999;
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  animation: ${pulse} 1.4s ease-in-out infinite;
  pointer-events: none;

  > img {
    display: block;
    width: min(48vw, 320px);
    height: auto;
    user-select: none;
    pointer-events: none;
  }
`;

/* ========== 전역 "윈도우 고정" 스팟들 ========== */
const OverlayLayer = styled.div`
  pointer-events: none; /* 클릭 방해 금지 */
  position: absolute;
  inset: 0;
  z-index: 10;
`;

const DottedCircleFixed = styled.div<{ $rect: DOMRect }>`
  position: fixed;
  left: ${p => p.$rect.x - 6}px;
  top: ${p => p.$rect.y - 6}px;
  width: ${p => p.$rect.width + 12}px;
  height: ${p => p.$rect.height + 12}px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  z-index: 2147483647;
`;

const SpotBubbleFixed = styled.div<{ $rect: DOMRect }>`
  position: fixed;
  left: ${p => p.$rect.x - p.$rect.width}px;
  top: ${p => p.$rect.y + p.$rect.height + 12}px; /* 요소 아래 */
  transform: translateX(-50%);
  max-width: 240px;
  background: var(--green-100);
  color: var(--text-1);
  border-radius: 23px 0 23px 23px;
  padding: 12px 16px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  z-index: 2147483647;
  pointer-events: none;
`;

const SpotDimFixed = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: fixed;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : "16px")};
  /* 나머지 화면 어둡게(구멍 효과) */
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.45);
  transition:
    left 0.06s linear,
    top 0.06s linear,
    width 0.06s linear,
    height 0.06s linear;
  z-index: 2147483646;
  pointer-events: none;
`;

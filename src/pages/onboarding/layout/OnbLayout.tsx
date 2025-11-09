// src/pages/home/onboarding/layout/OnbLayout.tsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css, keyframes } from "styled-components";

import bigSiren from "@/assets/images/big-siren.svg";

import type { OnbStage } from "../engine/stages";

export type SceneProps = {
  stage: OnbStage;
  setSpotRect: (r: DOMRect | null) => void;
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
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    const el = document.createElement("div");
    el.setAttribute("id", "onb-portal");
    el.style.position = "relative";
    el.style.zIndex = "2147483647";
    document.body.appendChild(el);
    setPortalEl(el);

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

  useEffect(() => setSpotRect(null), [stage?.id]);

  const localSpot = useMemo(() => {
    if (!spotRect || !frameRef.current) return null;
    const fr = frameRef.current.getBoundingClientRect();
    return new DOMRect(spotRect.x - fr.x, spotRect.y - fr.y, spotRect.width, spotRect.height);
  }, [spotRect]);

  // --- 키 네비는 유지 ---
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onSkip]);

  // ====== 새 로직: 인터랙션 시 한 번만 다음으로 이동 ======
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

  // 프레임 안에서 특정 요소는 제외하고 싶을 때: data-onb-no-advance="true"
  const shouldIgnoreTarget = (el: EventTarget | null) => {
    let n = el as HTMLElement | null;
    while (n) {
      if (n.getAttribute && n.getAttribute("data-onb-no-advance") === "true") return true;
      n = n.parentElement;
    }
    return false;
  };

  // Root 배경 클릭으로 좌/우 반 화면 네비게이션
  const handleRootClick = (e: React.MouseEvent) => {
    // 프레임 내부 클릭이면 무시 (프레임 컨테이너에서 stopPropagation 함)
    const x = e.clientX;
    const mid = window.innerWidth / 2;
    if (x < mid) onPrev?.();
    else advanceNextIfAllowed();
  };

  // 프레임 내부 "어느 인터랙션이든" 다음으로 진행
  // PointerDown이 대부분의 터치/클릭을 커버. 입력은 input/change/keydown Enter 보강.
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

  return createPortal(
    <Root $transparentBg={showBigSiren} onClick={handleRootClick}>
      <FrameWrap>
        <Frame
          ref={frameRef}
          aria-label="Onboarding Frame"
          // 프레임 내부 클릭은 루트로 버블링되지 않게
          onClick={e => e.stopPropagation()}
          onPointerDown={onFramePointerDown}
          onKeyDown={onFrameKeyDown}
          onInput={onFrameInput}
          onWheel={onFrameWheel}
          tabIndex={-1} // 키 이벤트 받기 위함
        >
          {Scene ? (
            <Scene key={stage.id} stage={stage} setSpotRect={setSpotRect} />
          ) : (
            <FramePlaceholder>sceneKey가 없습니다.</FramePlaceholder>
          )}

          <FrameOverlay>
            {localSpot && (
              <SpotDim $rect={localSpot} $radius={stage.componentKey === "goal-card" ? 12 : 9999} />
            )}
            {stage.pulse && localSpot ? <Pulse $rect={localSpot} /> : null}
            {stage.placement === "center" && stage.body ? (
              <CenterBubble>
                {stage.title ? <h3>{stage.title}</h3> : null}
                <p>{stage.body}</p>
              </CenterBubble>
            ) : null}

            {stage.componentKey === "chatbot" && localSpot ? (
              <>
                <DottedCircle $rect={localSpot} />
                <SpotBubble $rect={localSpot}>AI 개구리 ‘Rana’</SpotBubble>
              </>
            ) : null}
          </FrameOverlay>

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

      {/* <BottomBar role="region" aria-label="Onboarding hint"> */}
      {/* <BarInner> */}
      <HintText className="typo-h4">{stage.body}</HintText>
      {/* </BarInner> */}
      {/* </BottomBar> */}
    </Root>,
    portalEl,
  );
}

/* ---------- styles (아래 기존과 동일) ---------- */
const Root = styled.div<{ $transparentBg?: boolean }>`
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  background: ${p => (p.$transparentBg ? "transparent" : "rgba(17, 24, 39, 0.85)")};
  backdrop-filter: ${p => (p.$transparentBg ? "none" : "blur(2px)")};
  /* 전체 영역 클릭 가능하므로 커서 힌트(선택): */
  cursor: pointer;
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
  /* 내부 인터랙션 활성화를 위한 포커스 가능 */
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

/* 하단 바: 프레임 밖, 화면 하단에 고정 (포털이기 때문에 앱 UI 위에 뜸) */
const BottomBar = styled.div`
  position: sticky;
  bottom: 0;
  width: 100%;
  padding: 12px 0 24px;
  background: linear-gradient(
    to bottom,
    rgba(17, 24, 39, 0),
    rgba(17, 24, 39, 0.25) 40%,
    rgba(17, 24, 39, 0.45)
  );
  display: grid;
  place-items: center;
`;

const BarInner = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 12px;
  width: min(420px, 90vw);
`;

const HintText = styled.div`
  background: transparent;
  color: var(--text-w1, #fff);
  border: none;
  padding: 12px;
  height: 10vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-bottom: 7vh;
  word-break: keep-all;
`;

const BarActions = styled.div`
  display: flex;
  gap: 8px;
`;

const BarBtn = styled.button<{ $primary?: boolean; $ghost?: boolean }>`
  border: none;
  border-radius: 12px;
  padding: 10px 12px;
  font-size: 13px;
  cursor: pointer;
  ${p =>
    p.$primary
      ? css`
          background: #16a34a;
          color: #fff;
        `
      : p.$ghost
        ? css`
            background: rgba(15, 23, 42, 0.06);
            color: #e5e7eb;
            border: 1px solid #475569;
          `
        : css`
            background: #111827;
            color: #e5e7eb;
            border: 1px solid #334155;
          `}
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

/* (옵션) 중앙 버블 - placement: 'center'일 때 프레임 안 중앙 */
const CenterBubble = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 360px;
  max-width: calc(100% - 24px);
  background: #ffffff;
  color: #0f172a;
  border-radius: 16px;
  border: 1px solid rgba(15, 23, 42, 0.08);
  box-shadow: 0 10px 40px rgba(2, 6, 23, 0.25);
  padding: 16px;
  pointer-events: auto;

  h3 {
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 800;
  }
  p {
    margin: 0;
    white-space: pre-wrap;
    line-height: 1.6;
  }
`;

const DottedCircle = styled.div<{ $rect: DOMRect }>`
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

const SpotBubble = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x + p.$rect.width / 2 - 68}px;
  top: ${p => p.$rect.y + p.$rect.height + 12}px; /* 요소 아래 */
  transform: translateX(-50%);
  width: 140px;
  max-width: 240px;
  background: var(--green-100); /* 연한 연두색 버블 */
  color: var(--text-1);
  border-radius: 23px 0 23px 23px;
  padding: 12px 16px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  pointer-events: none; /* 오버레이가 클릭 방해하지 않도록 */
  z-index: 10;
`;
const SpotDim = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: absolute;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;

  /* 단순 반경 값만 prop으로 전달 */
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : "14px")};

  /* 프레임 안쪽만 투명하게, 나머지 전체 어둡게 덮기 */
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
  position: fixed; /* 화면 전체 */
  inset: 0;
  background: rgba(0, 0, 0, 0.85); /* 적당한 어둡기 */
  z-index: 7;
  pointer-events: none;
`;

/** 사이렌 살짝 펄스 애니메이션 */
const pulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.95; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

/** 중앙 고정 사이렌 */
const CenterSiren = styled.figure`
  position: fixed;
  left: 39%;
  top: 50%;
  width: min(28vw, 320px);
  z-index: 9999; /* 디밍보다 위 */
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  animation: ${pulse} 1.4s ease-in-out infinite;

  > img {
    display: block;
    width: min(48vw, 320px); /* 반응형: 모바일 기준 크게 보이도록 */
    height: auto;
    user-select: none;
    pointer-events: none;
  }
`;

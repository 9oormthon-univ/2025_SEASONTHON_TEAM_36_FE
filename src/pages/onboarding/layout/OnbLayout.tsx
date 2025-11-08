// src/pages/home/onboarding/layout/OnbLayout.tsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled, { css, keyframes } from "styled-components";

import type { OnbStage } from "../engine/stages";

export type SceneProps = {
  stage: OnbStage;
  /** window 좌표 기준(getBoundingClientRect) */
  setSpotRect: (r: DOMRect | null) => void;
};

export interface OnbLayoutProps {
  sceneMap: Record<string, React.ComponentType<SceneProps>>;
  stages: OnbStage[];
  activeIndex?: number;
  onPrev?: () => void;
  onNext?: () => void;
  onSkip?: () => void;
}

export default function OnbLayout({
  sceneMap,
  stages,
  activeIndex: extIndex,
  onPrev,
  onNext,
  onSkip,
}: OnbLayoutProps) {
  // ✅ 훅 호출 순서 고정
  const [spotRect, setSpotRect] = useState<DOMRect | null>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    // 전용 포털 컨테이너 생성 (z-index 최상단)
    const el = document.createElement("div");
    el.setAttribute("id", "onb-portal");
    el.style.position = "relative";
    el.style.zIndex = "2147483647"; // 진짜 최상단
    document.body.appendChild(el);
    setPortalEl(el);

    // 스크롤 락
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.removeChild(el);
    };
  }, []);

  const activeIndex = useMemo(() => extIndex ?? 0, [extIndex]);
  const stage = stages[activeIndex] ?? null;

  // 프레임 내부 좌표로 변환
  const localSpot = useMemo(() => {
    if (!spotRect || !frameRef.current) return null;
    const fr = frameRef.current.getBoundingClientRect();
    return new DOMRect(spotRect.x - fr.x, spotRect.y - fr.y, spotRect.width, spotRect.height);
  }, [spotRect]);

  // 키 네비
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSkip?.();
      if (e.key === "ArrowLeft") onPrev?.();
      if (e.key === "ArrowRight") onNext?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onPrev, onNext, onSkip]);

  if (!stage || !portalEl) return null;
  const Scene = stage.sceneKey ? sceneMap[stage.sceneKey] : undefined;

  return createPortal(
    <Root>
      {/* 액자 프레임 */}
      <FrameWrap>
        <Frame ref={frameRef} aria-label="Onboarding Frame">
          {Scene ? (
            <Scene key={stage.id} stage={stage} setSpotRect={setSpotRect} />
          ) : (
            <FramePlaceholder>sceneKey가 없습니다.</FramePlaceholder>
          )}

          {/* 프레임 내부 오버레이(펄스/가이드 등) */}
          <FrameOverlay>
            {stage.pulse && localSpot ? <Pulse $rect={localSpot} /> : null}
            {stage.placement === "center" && stage.body ? (
              <CenterBubble>
                {stage.title ? <h3>{stage.title}</h3> : null}
                <p>{stage.body}</p>
              </CenterBubble>
            ) : null}
            {stage.componenetKey === "chatbot" && localSpot ? (
              <>
                <DottedCircle $rect={localSpot} />
                <SpotBubble $rect={localSpot}>AI 개구리 ‘Rana’</SpotBubble>
              </>
            ) : null}
          </FrameOverlay>
        </Frame>
      </FrameWrap>

      {/* 하단 바(포털 상단에 있으므로 바텀시트/탭바 위로 올라옴) */}
      <BottomBar role="region" aria-label="Onboarding hint">
        <BarInner>
          <HintText>{stage.body}</HintText>
          <BarActions>
            {onPrev ? <BarBtn onClick={onPrev}>이전</BarBtn> : null}
            {onSkip ? (
              <BarBtn $ghost onClick={onSkip}>
                건너뛰기
              </BarBtn>
            ) : null}
            {onNext ? (
              <BarBtn $primary onClick={onNext}>
                다음
              </BarBtn>
            ) : null}
          </BarActions>
        </BarInner>
      </BottomBar>
    </Root>,
    portalEl,
  );
}

/* ---------- helpers ---------- */
// function useBubblePositionInFrame(_rect: DOMRect | null, _placement: Placement) {
//   // 현재는 center만 쓰므로 생략 가능. 필요 시 확장.
//   return { leftInFrame: 0, topInFrame: 0 };
// }

/* ---------- styles ---------- */
const Root = styled.div`
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  /* 배경을 살짝 어둡게 해 원본 화면을 '뒤'로 보이게 */
  background: rgba(17, 24, 39, 0.85);
  backdrop-filter: blur(2px);
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
  background: #0b1220;
  color: #e5e7eb;
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 10px 14px;
  font-size: 14px;
  line-height: 1.45;
  box-shadow: 0 6px 18px rgba(2, 6, 23, 0.35);
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

// OnbLayout.tsx 가장 아래 스타일 구역에 추가
const DottedCircle = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x - 5}px;
  top: ${p => p.$rect.y - 5}px;
  width: 50px;
  height: 50px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  box-shadow:
    0 0 0 8px rgba(255, 255, 255, 0.12),
    0 6px 20px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(0.5px);
  pointer-events: none;
  z-index: 6;
`;

const SpotBubble = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x + p.$rect.width / 2 - 65}px;
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
`;

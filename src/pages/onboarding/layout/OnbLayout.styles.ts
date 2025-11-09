import styled, { keyframes } from "styled-components";
// OnbLayout.styles.ts
import { css } from "styled-components";

/* ================================
 * Z-INDEX & DIMENSIONS
 * ============================== */
const Z = {
  portal: 2147483647,
  overlay: 2147483646,
  skipBtn: 2147483647,
  siren: 9999,
  dim: 7,
  frameOverlay: 5,
  hint: 50,
};

const FRAME = {
  width: "min(420px, 80vw)",
  height: "min(800px, 70vh)",
  radius: 28,
};

const LOCAL_DIM_RADIUS_DEFAULT = 14;
const FIXED_DIM_RADIUS_DEFAULT = 16;

/* ================================
 * KEYFRAMES
 * ============================== */
const pulseKey = keyframes`
  0% { opacity: .6; transform: scale(.98); }
  60% { opacity: .15; transform: scale(1.04); }
  100% { opacity: 0; transform: scale(1.08); }
`;

const bubblePulse = keyframes`
  0%   { transform: translateX(-50%) scale(1);    opacity: 1; }
  50%  { transform: translateX(-50%) scale(1.03); opacity: .98; }
  100% { transform: translateX(-50%) scale(1);    opacity: 1; }
`;

const bubbleHalo = keyframes`
  0%   { opacity: .35; transform: scale(.96); }
  60%  { opacity: 0;   transform: scale(1.08); }
  100% { opacity: 0;   transform: scale(1.12); }
`;

const sirenPulse = keyframes`
  0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
  50% { transform: translate(-50%, -50%) scale(1.04); opacity: 0.95; }
  100% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
`;

/* ===== Animations ===== */
const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(8px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const floatY = keyframes`
  0%   { transform: translateY(0); }
  50%  { transform: translateY(-6px); }
  100% { transform: translateY(0); }
`;

const pulse = keyframes`
  0%,100% { transform: scale(1);    opacity: 1; }
  50%     { transform: scale(1.03); opacity: .95; }
`;

const slideUp = keyframes`
  0%   { transform: translateY(20px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
`;

/* 간단 타이핑 효과 (글자 클리핑 + 커서 깜박임) */
const typing = (chars: number) => keyframes`
  from { clip-path: inset(0 100% 0 0); }
  to   { clip-path: inset(0 0    0 0); }
`;
const caret = keyframes`
  0%, 49% { opacity: 1; }
  50%,100%{ opacity: 0; }
`;

/* ===== Props ===== */
export type HintAnim = "none" | "fade-up" | "float" | "pulse" | "slide-up" | "typing";

type HintTextAnimProps = {
  $anim?: HintAnim;
  $durationMs?: number;
  $delayMs?: number;
  $loop?: boolean;
  /** typing 전용: 대략 글자 수 (없으면 길이에 맞춰 추정치 사용) */
  $typingChars?: number;
};

/* ================================
 * STYLED COMPONENTS
 * ============================== */
export const Root = styled.div<{ $transparentBg?: boolean }>`
  position: fixed;
  inset: 0;
  display: grid;
  grid-template-rows: 1fr auto;
  background: ${p => (p.$transparentBg ? "transparent" : "rgba(17, 24, 39, 0.85)")};
  backdrop-filter: ${p => (p.$transparentBg ? "none" : "blur(2px)")};
  cursor: pointer; /* 화면 배경 클릭 네비 */
  -webkit-tap-highlight-color: transparent;
`;

export const FrameWrap = styled.div`
  display: grid;
  place-items: center;
  padding: 40px 0 12px;
`;

export const Frame = styled.div`
  position: relative;
  width: ${FRAME.width};
  height: ${FRAME.height};
  background: #ffffff;
  border-radius: ${FRAME.radius}px;
  box-shadow:
    0 24px 60px rgba(0, 0, 0, 0.45),
    0 0 0 2px rgba(0, 0, 0, 0.06) inset;
  overflow: hidden;
  outline: none;
  cursor: default;
  margin-top: auto;
`;

export const FrameOverlay = styled.div`
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: ${Z.frameOverlay};
`;

export const FramePlaceholder = styled.div`
  padding: 32px;
  color: #94a3b8;
`;

/* 하단 힌트 텍스트 */
export const HintText = styled.div<
  {
    $centered?: boolean;
    $isSiren?: boolean;
  } & HintTextAnimProps
>`
  background: transparent;
  color: var(--text-w1, #fff);
  border: none;
  padding: 12px;
  text-align: center;
  word-break: keep-all;
  white-space: pre-line;
  z-index: ${Z.hint};
  position: ${p => (p.$centered ? "fixed" : "relative")};
  left: 0;
  right: 0;

  /* 일반 상태: 화면 하단 근처 */
  height: ${p => (p.$centered ? "auto" : "10vh")};
  margin-bottom: ${p => (p.$centered ? "0" : "10vh")};
  display: flex;
  flex-direction: column;
  justify-content: center;

  /* 중앙 또는 약간 아래 정렬 */
  top: ${p => (p.$centered ? (p.$isSiren ? "65%" : "50%") : "auto")};
  transform: ${p => (p.$centered ? "translateY(-50%)" : "none")};

  ${({ $centered }) =>
    $centered &&
    css`
      text-align: center;
    `}

  ${({ $anim = "fade-up", $durationMs = 600, $delayMs = 0, $loop, $typingChars }) => {
    if ($anim === "none") return "";

    /* 접근성: reduce-motion일 때는 기본 페이드만 */
    const base = css`
      @media (prefers-reduced-motion: reduce) {
        animation: ${fadeUp} ${Math.min($durationMs, 400)}ms ease ${$delayMs}ms both;
      }
    `;

    switch ($anim) {
      case "fade-up":
        return css`
          animation: ${fadeUp} ${$durationMs}ms ease ${$delayMs}ms both;
          ${base}
        `;
      case "float":
        return css`
          animation:
            ${fadeUp} 420ms ease ${$delayMs}ms both,
            ${floatY} ${Math.max($durationMs, 2000)}ms ease-in-out ${$delayMs + 420}ms
              ${$loop !== false ? "infinite" : "both"};
          ${base}
        `;
      case "pulse":
        return css`
          animation:
            ${fadeUp} 360ms ease ${$delayMs}ms both,
            ${pulse} ${Math.max($durationMs, 1200)}ms ease-in-out ${$delayMs + 360}ms
              ${$loop !== false ? "infinite" : "both"};
          ${base}
        `;
      case "slide-up":
        return css`
          animation: ${slideUp} ${$durationMs}ms cubic-bezier(0.22, 1, 0.36, 1) ${$delayMs}ms both;
          ${base}
        `;
      case "typing": {
        const chars = $typingChars ?? 24; // 대충 기본값
        return css`
          display: inline-block;
          white-space: nowrap;
          animation: ${typing(chars)} ${Math.max($durationMs, chars * 40)}ms steps(${chars})
            ${$delayMs}ms both;
          position: relative;
          &::after {
            content: "";
            position: absolute;
            right: -0.25em;
            top: 0;
            bottom: 0;
            width: 2px;
            background: currentColor;
            animation: ${caret} 1s steps(1) ${$delayMs}ms ${$loop !== false ? "infinite" : "both"};
          }
          ${base}
        `;
      }
    }
  }}
`;

/* 하단 공간 보존용 스페이서 */
export const HintSpacer = styled.div`
  height: 17vh; /* height(10vh) + margin-bottom(7vh) */
`;

/* 프레임 내부 하이라이트(펄스) */
export const Pulse = styled.div<{ $rect: DOMRect }>`
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
export const DottedCircleLocal = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x - 6}px;
  top: ${p => p.$rect.y - 6}px;
  width: ${p => p.$rect.width + 12}px;
  height: ${p => p.$rect.height + 12}px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  pointer-events: none;
  z-index: ${Z.frameOverlay};
`;

export const SpotBubbleLocal = styled.div<{ $rect: DOMRect }>`
  position: absolute;
  left: ${p => p.$rect.x - p.$rect.width}px;
  top: ${p => p.$rect.y + p.$rect.height + 12}px;
  transform: translateX(-50%);
  min-width: 135px;
  max-width: 240px;
  background: var(--green-100);
  color: var(--text-1);
  border-radius: 23px 0 23px 23px;
  padding: 12px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  pointer-events: none;
  z-index: ${Z.frameOverlay};
  will-change: transform, box-shadow;
  animation: ${bubblePulse} 1.6s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 26px 3px 26px 26px;
    border: 2px solid rgba(59, 130, 246, 0.35);
    animation: ${bubbleHalo} 1.6s ease-out infinite;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &::after {
      animation: none;
    }
  }
`;

export const SpotDimLocal = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: absolute;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : `${LOCAL_DIM_RADIUS_DEFAULT}px`)};
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
export const DimOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: ${Z.dim};
  pointer-events: none;
`;

/** 중앙 고정 사이렌 */
export const CenterSiren = styled.figure`
  position: fixed;
  left: 39%;
  top: 45%;
  width: min(28vw, 320px);
  z-index: ${Z.siren};
  transform: translate(-50%, -50%);
  margin: 0;
  padding: 0;
  animation: ${sirenPulse} 1.4s ease-in-out infinite;
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
export const OverlayLayer = styled.div`
  pointer-events: none;
  position: absolute;
  inset: 0;
  z-index: 10;
`;

export const DottedCircleFixed = styled.div<{ $rect: DOMRect }>`
  position: fixed;
  left: ${p => p.$rect.x - 6}px;
  top: ${p => p.$rect.y - 6}px;
  width: ${p => p.$rect.width + 12}px;
  height: ${p => p.$rect.height + 12}px;
  border: 2.5px dashed rgba(255, 255, 255, 0.95);
  border-radius: 9999px;
  z-index: ${Z.portal};
`;

export const SpotBubbleFixed = styled.div<{ $rect: DOMRect }>`
  position: fixed;
  left: ${p => p.$rect.x - p.$rect.width}px;
  top: ${p => p.$rect.y + p.$rect.height + 12}px;
  transform: translateX(-50%);
  max-width: 240px;
  background: var(--green-100);
  color: var(--text-1);
  border-radius: 23px 0 23px 23px;
  padding: 12px 16px;
  font-size: 14px;
  box-shadow: 0 8px 24px rgba(2, 6, 23, 0.25);
  border: 1px solid rgba(15, 23, 42, 0.08);
  z-index: ${Z.portal};
  pointer-events: none;
  will-change: transform, box-shadow;
  animation: ${bubblePulse} 1.6s ease-in-out infinite;

  &::after {
    content: "";
    position: absolute;
    inset: -6px;
    border-radius: 26px 3px 26px 26px;
    border: 2px solid rgba(59, 130, 246, 0.35);
    animation: ${bubbleHalo} 1.6s ease-out infinite;
    pointer-events: none;
  }

  @media (prefers-reduced-motion: reduce) {
    animation: none;
    &::after {
      animation: none;
    }
  }
`;

export const SpotDimFixed = styled.div<{ $rect: DOMRect; $radius?: number }>`
  position: fixed;
  left: ${p => p.$rect.x}px;
  top: ${p => p.$rect.y}px;
  width: ${p => p.$rect.width}px;
  height: ${p => p.$rect.height}px;
  border-radius: ${p => (p.$radius ? `${p.$radius}px` : `${FIXED_DIM_RADIUS_DEFAULT}px`)};
  box-shadow: 0 0 0 9999px rgba(15, 23, 42, 0.45);
  transition:
    left 0.06s linear,
    top 0.06s linear,
    width 0.06s linear,
    height 0.06s linear;
  z-index: ${Z.overlay};
  pointer-events: none;
`;

export const SkipBtn = styled.button`
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 12px);
  right: calc(env(safe-area-inset-right, 0px) + 12px);
  z-index: ${Z.skipBtn};

  height: 28px;
  padding: 0 10px;
  border-radius: 9999px;

  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.02em;

  color: rgba(255, 255, 255, 0.95);
  background: rgba(17, 24, 39, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.18);
  backdrop-filter: blur(6px);

  display: inline-flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent;

  transition:
    transform 0.12s ease,
    background-color 0.12s ease,
    opacity 0.12s ease;

  &:hover {
    background: rgba(17, 24, 39, 0.66);
  }
  &:active {
    transform: scale(0.98);
  }
  &:focus-visible {
    outline: 2px solid rgba(59, 130, 246, 0.9);
    outline-offset: 2px;
  }

  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
`;

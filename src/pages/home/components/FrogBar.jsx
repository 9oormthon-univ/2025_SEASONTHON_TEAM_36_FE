import React from "react";
import styled from "styled-components";

import frogIndicator from "@/assets/images/frog-indicator.svg";

/** 진행 막대 + 마커 + 물결오버레이 */
export default function FrogBar({ progress = 0, className, style }) {
  const p = Math.max(0, Math.min(100, Number(progress) || 0));

  return (
    <Bar
      className={className}
      style={{ "--p": String(p), ...(style || {}) }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={p}
      aria-label="진행률"
    >
      <div className="track" />
      <div className="fill" />
      <div className="marker" role="img" aria-label="frog">
        <img src={frogIndicator} alt="개구리 표시" />
      </div>

      {/* 물결 오버레이: 개구리 위로 덮이도록 marker 다음에 둬서 z-index 우위 */}
      {/* 받아온 progress가 0이면 wave 자체를 렌더링하지 않음 */}
      {progress > 0 && <div className="wave" aria-hidden="true" />}
    </Bar>
  );
}

const Bar = styled.div`
  position: absolute;
  left: 8px;
  top: 12px;
  bottom: 12px;
  width: 28px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-left: 2%;
  --marker-size: 26px;
--marker-half: calc(var(--marker-size) / 2);

  /* 조정용 변수 */
  --p-clamped: clamp(9, var(--p, 0), 100);
  --wave-h: 40px;        /* 파도 높이 */
  --wave-size-x: 90px;  /* 파도 한 주기 가로 길이 */
  --wave-offset: 16px;   /* 물결이 물 위로 얼마나 올라오게 할지(덮임 깊이) */

  .track {
    position: absolute;
    inset: 0;
    background: var(--green-100);
  }

  .fill {
    position: absolute;
    left: 0px; right: 0px; bottom: 0px;
    background: var(--blue);
    height: clamp(0px, calc(var(--p-clamped) * 1% - 10px), 100%);
    z-index: 2; 
  }

  .marker {
    position: absolute;
    left: 50%;
    bottom: calc(var(--p-clamped) * 1%);
    transform: translate(-50%, 50%);
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    font-size: 16px;
    pointer-events: none;
    z-index: 1; /* 파도보다 아래 */
  }


  /* ===== 물결 오버레이 ===== */
  .wave {
  /* intensity: 진행률 0~1 스케일 */
    --int: clamp(0, calc((var(--p-clamped) - 8) / 92), 1);
   /* 진행률↑ → 파도 높이(진폭)↑ */
   --wave-h: calc(10px + 10px * var(--int));
   /* 진행률↑ → 수평 이동 속도↑ */
   --spd: calc(4s - 2.5s * var(--int));
   /* 진행률↑ → 상하 흔들림 빠르게 */
   --bob-time: calc(4s - 1.2s * var(--int));
   /* 진행률↑ → 상하 흔들림 폭↑ */
   --bob-amp: calc(1px + 6px * var(--int));

    position: absolute;
    left: 0px; right: 0px;
    height: var(--wave-h);
    /* 물 위 경계에 맞추되, 살짝 위로 끌어올려 개구리를 덮도록 */
    bottom: calc(var(--p-clamped) * 1% - var(--wave-offset));
    background: var(--blue);
    z-index: 3;          /* 개구리 위에 덮이게 */
    pointer-events: none;
    opacity: 0.98;

    /* Safari/Chromium 모두 호환 */
    mask-type: luminance;
    -webkit-mask-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 44' preserveAspectRatio='none'>\
<path d='M0 20 C30 10 50 30 80 20 C110 10 130 30 160 20 V44 H0 Z' fill='white'/>\
</svg>");
    mask-image: url("data:image/svg+xml;utf8,\
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 44' preserveAspectRatio='none'>\
<path d='M0 20 C30 10 50 30 80 20 C110 10 130 30 160 20 V44 H0 Z' fill='white'/>\
</svg>");
    -webkit-mask-repeat: repeat-x;
    mask-repeat: repeat-x;
    -webkit-mask-size: var(--wave-size-x) var(--wave-h);
    mask-size: var(--wave-size-x) var(--wave-h);

    animation: waveShift 4s linear infinite;

    /* 성능 약간 플러스 */
    contain: paint;
    will-change: mask-position, bottom;
  }

  @keyframes waveShift {
    from {
      -webkit-mask-position: 0 0;
      mask-position: 0 0;
    }
    to {
      -webkit-mask-position: var(--wave-size-x) 0;
      mask-position: var(--wave-size-x) 0;
    }
  }

  /* (선택) 모션 줄이기 접근성 */
  @media (prefers-reduced-motion: reduce) {
    .wave { animation-duration: 12s; }
  }
`;
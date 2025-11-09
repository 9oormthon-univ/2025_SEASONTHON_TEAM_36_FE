import styled from "styled-components";

import frogIndicator from "@/assets/images/frog-indicator.svg";

type FrogBarProps = {
  progress?: number; // 0~100
  className?: string;
  style?: React.CSSProperties & { ["--p"]?: string | number };
};
/** 진행 막대 + 마커 + 물결오버레이 */
export default function OnbFrogBar({ progress = 0, className, style }: FrogBarProps) {
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
  width: 20px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  margin-left: 2%;

  /* 🔹 여기 값만 바꾸면 마커 크기 조절 가능 */
  --marker-size: 24px;
  --marker-half: calc(var(--marker-size) / 2);

  --p-clamped: clamp(9, var(--p, 0), 100);
  --wave-h: 40px;
  --wave-size-x: 90px;
  --wave-offset: 16px;

  .track {
    position: absolute;
    inset: 0;
    background: var(--green-100);
  }

  .fill {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--blue);
    height: clamp(0px, calc(var(--p-clamped) * 1% - 10px), 100%);
    z-index: 2;
  }

  /* 🔧 기존 26px 고정 → 변수 사용 */
  .marker {
    position: absolute;
    left: 3%;
    bottom: calc(var(--p-clamped) * 0.987%);
    transform: translate(var(--marker-overflow-x, 6px), 50%);
    width: var(--marker-size);
    height: var(--marker-size);
    display: grid;
    place-items: center;
    pointer-events: none;
    z-index: 1; /* 파도(.wave: z=3) 아래 유지 → 바 내부에선 파도에 살짝 가림 */
  }

  /* 🔧 이미지가 컨테이너 크기를 따르도록 */
  .marker img {
    display: block;
    width: 150%;
    height: 150%;
    object-fit: contain;
  }

  .wave {
    --int: clamp(0, calc((var(--p-clamped) - 8) / 92), 1);
    --wave-h: calc(10px + 10px * var(--int));
    --spd: calc(4s - 2.5s * var(--int));
    --bob-time: calc(4s - 1.2s * var(--int));
    --bob-amp: calc(1px + 6px * var(--int));
    position: absolute;
    left: 0;
    right: 0;
    height: var(--wave-h);
    bottom: calc(var(--p-clamped) * 1% - var(--wave-offset));
    background: var(--blue);
    z-index: 3;
    pointer-events: none;
    opacity: 0.98;
    mask-type: luminance;
    -webkit-mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 44' preserveAspectRatio='none'><path d='M0 20 C30 10 50 30 80 20 C110 10 130 30 160 20 V44 H0 Z' fill='white'/></svg>");
    mask-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 160 44' preserveAspectRatio='none'><path d='M0 20 C30 10 50 30 80 20 C110 10 130 30 160 20 V44 H0 Z' fill='white'/></svg>");
    -webkit-mask-repeat: repeat-x;
    mask-repeat: repeat-x;
    -webkit-mask-size: var(--wave-size-x) var(--wave-h);
    mask-size: var(--wave-size-x) var(--wave-h);
    animation: waveShift 4s linear infinite;
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

  @media (prefers-reduced-motion: reduce) {
    .wave {
      animation-duration: 12s;
    }
  }
`;

import React from "react";
import styled from "styled-components";
import frogIndicator from "@/assets/images/frog-indicator.svg";
/**
 * 진행 막대 + 마커 컴포넌트
 * - progress: 0~100
 */
export default function FrogBar({ progress, className, style }) {
  return (
    <Bar
      className={className}
      style={{ "--p": progress, ...(style || {}) }}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      aria-label="진행률"
    >
      <div className="track" />
      <div className="fill" />
      <div className="marker" role="img" aria-label="frog">
        <img src={frogIndicator} alt="개구리 표시"/>
      </div>
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

  .track {
    position: absolute;
    inset: 0;
    background: var(--green-100);
  }

  .fill {
    position: absolute;
    left: 0px;
    right: 0px;
    bottom: 0px;
    background: var(--blue);
    height: calc(var(--p) * 1% - 4px);
  }

  .marker {
    position: absolute;
    left: 50%;
    bottom: calc(var(--p, 55) * 1%);
    transform: translate(-50%, 50%);
    width: 26px;
    height: 26px;
    display: grid;
    place-items: center;
    font-size: 16px;
  }
`;

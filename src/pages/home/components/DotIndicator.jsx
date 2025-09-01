// src/components/DotIndicator.jsx
import React from "react";
import styled from "styled-components";

/**
 * DotIndicator (index 기반, 단일 활성)
 * - index: 0-based 현재 위치 (0 ~ steps-1)
 * - steps: 점 개수(>=2)
 * - size: 점 지름(px)
 * - gap: 점 간격(px)
 */
export default function DotIndicator({
  index = 0,
  steps = 4,
  size = 10,
  gap = 8,
  className,
  "aria-label": ariaLabel = "진행 단계",
}) {
  const total = Math.max(2, Math.floor(steps));
  const activeIndex = clamp(index, 0, total - 1);

  return (
    <Bar
      role="meter"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={activeIndex + 1}
      aria-label={`${ariaLabel} ${activeIndex + 1}/${total}`}
      $gap={gap}
      className={className}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} $size={size} $active={i === activeIndex} aria-hidden="true" />
      ))}
    </Bar>
  );
}

/* utils */
function clamp(n, min, max) {
  return Math.min(max, Math.max(min, n));
}

/* styles */
const Bar = styled.div`
  display: inline-flex;
  align-items: center;
  margin: 40px;
  justify-content: center;
  gap: ${(p) => p.$gap}px;
`;

/* 디자인 토큰 사용:
   - 활성: var(--brand-1)
   - 비활성: var(--surface-2), 테두리 var(--natural-400) */
const Dot = styled.span`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  border-radius: 9999px;

  /* 기본(꺼짐) */
  background: var(--icon-1);
  transition: background 160ms ease, border-color 160ms ease, opacity 160ms ease;

  /* 활성(현재 index만) */
  ${(p) =>
    p.$active &&
    `
      background: var(--icon);
    `}
`;

// src/components/DotIndicator.jsx
import React from "react";
import styled from "styled-components";

/**
 * DotIndicator (index 기반, 단일 활성)
 * - index: 0-based 현재 위치 (0 ~ STEPS-1)
 * 고정값: STEPS=5, DOT_SIZE=10, GAP=8
 */
const STEPS = 5;
const DOT_SIZE = 10;
const GAP = 8;

export default function DotIndicator({
  index = 0,
  className,
  "aria-label": ariaLabel = "진행 단계",
}) {
  const total = STEPS;
  const activeIndex = clamp(index, 0, total - 1);

  return (
    <Bar
      role="meter"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={activeIndex + 1}
      aria-label={`${ariaLabel} ${activeIndex + 1}/${total}`}
      className={className}
    >
      {Array.from({ length: total }).map((_, i) => (
        <Dot key={i} $active={i === activeIndex} aria-hidden="true" />
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
  justify-content: center;
  margin: 40px;
  gap: ${GAP}px;
`;

/* 디자인 토큰 사용:
   - 활성: var(--icon)
   - 비활성: var(--icon-1) */
const Dot = styled.span`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
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

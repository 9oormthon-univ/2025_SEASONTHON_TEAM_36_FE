// src/components/DotIndicator.jsx
import React from "react";
import styled from "styled-components";

/**
 * DotIndicator
 * - index: 현재 0-based 인덱스
 * - total: 전체 슬라이드 개수
 * - maxDots: 표시할 최대 점 개수(기본 5)
 * - aria-label: 접근성 라벨
 */
export default function DotIndicator({
  index = 0,
  total = 5,
  maxDots = 5,
  className,
  "aria-label": ariaLabel = "진행 단계",
}) {
  const clampedTotal = Math.max(0, Number(total) || 0);
  const clampedIndex = clamp(index, 0, Math.max(0, clampedTotal - 1));
  const visible = Math.min(maxDots, Math.max(1, clampedTotal));

  // 창 시작 위치 계산
  const start = getWindowStart(clampedIndex, clampedTotal, visible);
  const activePos = clampedIndex - start; // 0..visible-1

  return (
    <Bar
      role="meter"
      aria-valuemin={1}
      aria-valuemax={clampedTotal || 1}
      aria-valuenow={(clampedIndex + 1) || 1}
      aria-label={`${ariaLabel} ${clampedIndex + 1}/${clampedTotal}`}
      className={className}
    >
      {Array.from({ length: visible }).map((_, i) => (
        <Dot key={i} $active={i === activePos} aria-hidden="true" />
      ))}
    </Bar>
  );
}

/* helpers */
function clamp(n, min, max) { return Math.min(max, Math.max(min, n)); }

/** 슬라이딩 창 시작 인덱스 계산 */
function getWindowStart(index, total, visible) {
  if (total <= visible) return 0;         // 전부 표시
  if (index <= 2) return 0;               // 앞쪽 고정
  if (index >= total - 3) return total - visible; // 뒤쪽 고정
  return index - 2;                        // 가운데 유지
}

/* styles */
const DOT_SIZE = 8;
const GAP = 8;

const Bar = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${GAP}px;
  margin: 3.34%;
`;

/* 디자인 토큰:
   - 활성: var(--icon)
   - 비활성: var(--icon-1) */
const Dot = styled.span`
  width: ${DOT_SIZE}px;
  height: ${DOT_SIZE}px;
  border-radius: 9999px;
  background: var(--icon-1);
  transition: background 160ms ease, opacity 160ms ease, transform 160ms ease;

  ${(p) => p.$active && `
    background: var(--icon);
    transform: scale(1.05);
  `}
`;

// src/components/DotIndicator.tsx
import styled from "styled-components";

// 컴포넌트 props
export interface DotIndicatorProps {
  index?: number;
  total?: number;
  maxDots?: number;
  dot?: number;
  activeScale?: number;
  edgeScale?: number;
  gap?: number;
  "aria-label"?: string;
}

// styled-components props
export interface DotBarProps {
  $gap: number;
}

export interface DotProps {
  $dot: number;
  $maxDot: number;
  $scale: number;
  $active: boolean;
}

export default function DotIndicator({
  index = 0,
  total = 5,
  maxDots = 5,
  dot = 8,
  activeScale = 1.2,
  edgeScale = 0.75,
  gap = 7,
  "aria-label": ariaLabel = "Goal 목록",
}: DotIndicatorProps) {
  const clampedTotal = Math.max(0, Number(total) || 0);
  if (clampedTotal <= 1) return null;

  const clampedIndex = clamp(index, 0, Math.max(0, clampedTotal - 1));
  const visible = Math.min(maxDots, Math.max(1, clampedTotal));

  // 창 계산
  const start = getWindowStart(clampedIndex, clampedTotal, visible);
  const activePos = clampedIndex - start; // 0..visible-1

  // 창 양끝에 숨겨진 슬라이드가 있는가?
  const hasLeftHidden = start > 0;
  const hasRightHidden = start + visible < clampedTotal;

  // 래퍼는 '최대 크기'로 고정 → scale로 내부 원 확대/축소
  const maxDot = Math.round(dot * Math.max(1, activeScale, edgeScale));

  return (
    <Bar
      role="meter"
      aria-valuemin={1}
      aria-valuemax={clampedTotal || 1}
      aria-valuenow={clampedIndex + 1 || 1}
      aria-label={`${ariaLabel} ${clampedIndex + 1}/${clampedTotal}`}
      $gap={gap}
    >
      {Array.from({ length: visible }).map((_, i) => {
        // 각 점의 배율 결정
        let scale = 1;
        if (i === activePos) scale = activeScale;
        else if (i === 0 && hasLeftHidden)
          scale = edgeScale; // 왼쪽 끝 축소
        else if (i === visible - 1 && hasRightHidden) scale = edgeScale; // 오른쪽 끝 축소

        return (
          <Dot
            key={i}
            $dot={dot}
            $maxDot={maxDot}
            $scale={scale}
            $active={i === activePos}
            aria-hidden="true"
          />
        );
      })}
    </Bar>
  );
}

/* helpers */
function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}
function getWindowStart(index: number, total: number, visible: number): number {
  if (total <= visible) return 0; // 전부 표시
  if (index <= 2) return 0; // 앞쪽 고정
  if (index >= total - 3) return total - visible; // 뒤쪽 고정
  return index - 2; // 가운데 유지
}

/* styles */
const Bar = styled.div<DotBarProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${p => p.$gap}px;
`;

/* 점 래퍼는 최대 크기로 고정, 실제 원은 ::after로 그리고 scale로 크기 변경 */
const Dot = styled.span<DotProps>`
  position: relative;
  width: ${p => p.$maxDot}px;
  height: ${p => p.$maxDot}px;
  flex: 0 0 ${p => p.$maxDot}px;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    top: 50%;
    width: ${p => p.$dot}px;
    height: ${p => p.$dot}px;
    border-radius: 9999px;
    background: var(--icon-1); /* 비활성 기본색 */
    transform: translate(-50%, -50%) scale(${p => p.$scale});
    transition:
      transform 200ms cubic-bezier(0.2, 0.8, 0.2, 1),
      background 160ms ease,
      opacity 160ms ease;
  }

  ${p =>
    p.$active &&
    `
      &::after { background: var(--icon); }
    `}

  @media (prefers-reduced-motion: reduce) {
    &::after {
      transition: none;
    }
  }
`;

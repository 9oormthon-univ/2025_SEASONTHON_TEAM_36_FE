import React, { useCallback } from "react";

import { COLOR_TONES, FROG_FACES } from "../constants/completionConstants";
import {
  DotButton,
  DotLabels,
  DotsRow,
  FrogImg,
  InnerDot,
  Wrapper,
} from "../styles/CompletionStyles";
import { CompletionSelectorProps } from "../types/completionTypes";

/**
 * Selector (1~5)
 * - 활성 버튼은 자리별로 frog-face-1..5.svg 표시
 * - 연한 초록 → 진한 초록 그라데이션 라인 위에 점 배치
 */
export default function CompletionSelector({
  name,
  value,
  onChange,
  min = 1,
  max = 5,
  leftLabel,
  rightLabel,
  className,
}: CompletionSelectorProps) {
  const handleKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onChange(Math.max(min, value - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onChange(Math.min(max, value + 1));
      } else if (/^[1-9]$/.test(e.key)) {
        const num = Number(e.key);
        if (num >= min && num <= max) onChange(num);
      }
    },
    [value, onChange, min, max],
  );

  return (
    <Wrapper className={className}>
      <DotsRow role="radiogroup" aria-label={name} tabIndex={0} onKeyDown={handleKey}>
        {Array.from({ length: max - min + 1 }).map((_, i) => {
          const n = i + min; // 자리(1~5)
          const active = value === n; // 현재 선택 여부
          const tone = COLOR_TONES[i] ?? "500";
          const faceSrc = FROG_FACES[n]; // 자리별 아이콘
          return (
            <DotButton
              key={n}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${n}점`}
              $active={active}
              $tone={tone}
              onClick={() => onChange(n)}
            >
              {active ? <FrogImg src={faceSrc} alt="" aria-hidden="true" /> : <InnerDot />}
            </DotButton>
          );
        })}
      </DotsRow>

      {(leftLabel || rightLabel) && (
        <DotLabels className="typo-label-s">
          <span>{leftLabel ?? ""}</span>
          <span>{rightLabel ?? ""}</span>
        </DotLabels>
      )}
    </Wrapper>
  );
}

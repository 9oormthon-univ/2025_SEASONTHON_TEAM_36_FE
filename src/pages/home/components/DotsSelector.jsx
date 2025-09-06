import React, { useCallback } from "react";
import styled from "styled-components";

/* 자리별 아이콘 (1~5) */
import frogFace1 from "@/assets/images/frog-face-1.svg";
import frogFace2 from "@/assets/images/frog-face-2.svg";
import frogFace3 from "@/assets/images/frog-face-3.svg";
import frogFace4 from "@/assets/images/frog-face-4.svg";
import frogFace5 from "@/assets/images/frog-face-5.svg";

const frogFaces = {
  1: frogFace1,
  2: frogFace2,
  3: frogFace3,
  4: frogFace4,
  5: frogFace5,
};

/**
 * DotsSelector (1~5)
 * - 활성 버튼은 자리별로 frog-face-1..5.svg 표시
 * - 연한 초록 → 진한 초록 그라데이션 라인 위에 점 배치
 */
export default function DotsSelector({
  name,
  value,
  onChange,
  min = 1,
  max = 5,
  leftLabel,
  rightLabel,
  className,
}) {
  const handleKey = useCallback(
    (e) => {
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
    [value, onChange, min, max]
  );

  const tones = ["100", "200", "300", "400", "500"]; // 좌→우 점 색상 농도

  return (
    <Wrapper className={className}>
      <DotsRow
        role="radiogroup"
        aria-label={name}
        tabIndex={0}
        onKeyDown={handleKey}
      >
        {Array.from({ length: max - min + 1 }).map((_, i) => {
          const n = i + min;                 // 자리(1~5)
          const active = value === n;        // 현재 선택 여부
          const tone = tones[i] ?? "500";
          const faceSrc = frogFaces[n];      // 자리별 아이콘
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

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7%;
`;

/* 트랙 라인 + 점 배치 줄 */
const DotsRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 4px; /* 라인 여유 */
  outline: none;

  /* 초록 그라데이션 라인 */
  &::before {
    content: "";
    position: absolute;
    left: 0; right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--green-200, #D9F4C7) 0%,
      var(--green-300, #BEEFA7) 25%,
      var(--green-400, #7ED957) 60%,
      var(--green-500, #3B873F) 100%
    );
    opacity: 0.95;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    border-radius: 999px;
    padding: 8px 2px; /* 포커스 시 살짝 커져도 레이아웃 유지 */
  }
`;

/* 각 점 버튼 */
const DotButton = styled.button`
  position: relative;
  z-index: 1; /* 라인 위에 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* 활성/비활성에 따라 크기/테두리 */
  width: ${(p) => (p.$active ? "54px" : "17px")};
  height: ${(p) => (p.$active ? "auto" : "17px")};
  border-radius: 50%;

  /* 비활성일 때만 작은 원 표시 (톤에 맞춰 색상 변화) */
  background: ${(p) =>
    p.$active ? "transparent" : `var(--green-${p.$tone}, var(--surface-1, #FFF))`};
  border: ${(p) =>
    p.$active ? "none" : "2px solid rgba(0,0,0,0.02)"}; /* 살짝 입체감 */

  &:active { transform: scale(0.96); }

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    outline-offset: 2px;
    border-color: var(--primary-1);
  }
`;

/* 비활성 내부점(작은 점) */
const InnerDot = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

/* 활성 상태에서 보이는 개구리 얼굴 (자리별) */
const FrogImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

/* 좌우 라벨 */
const DotLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-1);
`;

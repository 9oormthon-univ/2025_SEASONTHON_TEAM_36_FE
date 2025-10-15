import { useCallback } from "react";
import styled from "styled-components";

/* 자리별 아이콘 (1~5) */
import frogFace1 from "@/assets/images/frog-face-1.svg";
import frogFace2 from "@/assets/images/frog-face-2.svg";
import frogFace3 from "@/assets/images/frog-face-3.svg";
import frogFace4 from "@/assets/images/frog-face-4.svg";
import frogFace5 from "@/assets/images/frog-face-5.svg";

const frogFaces: Record<number, string> = {
  1: frogFace1,
  2: frogFace2,
  3: frogFace3,
  4: frogFace4,
  5: frogFace5,
};

export interface DotsSelectorProps {
  /** 그룹 이름 (접근성용) */
  name: string;
  /** 현재 값 (1~5) */
  value: number;
  /** 값 변경 핸들러 */
  onChange: (value: number) => void;
  /** 최소 점수 (기본 1) */
  min?: number;
  /** 최대 점수 (기본 5) */
  max?: number;
  /** 왼쪽 라벨 */
  leftLabel?: string;
  /** 오른쪽 라벨 */
  rightLabel?: string;
  /** 추가 className */
  className?: string;
}

export default function DotsSelector({
  name,
  value,
  onChange,
  min = 1,
  max = 5,
  leftLabel,
  rightLabel,
  className,
}: DotsSelectorProps) {
  const handleKey = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
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

  const tones = ["100", "200", "300", "400", "500"] as const;

  return (
    <Wrapper className={className}>
      <DotsRow role="radiogroup" aria-label={name} tabIndex={0} onKeyDown={handleKey}>
        {Array.from({ length: max - min + 1 }).map((_, i) => {
          const n = i + min; // 자리 (1~5)
          const active = value === n;
          const tone = tones[i] ?? "500";
          const faceSrc = frogFaces[n];
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

/** ============================
 * 💅 Styled Components
 * ============================ */

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7%;
`;

const DotsRow = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 8px 4px;
  outline: none;

  &::before {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    height: 4px;
    border-radius: 999px;
    background: linear-gradient(
      90deg,
      var(--green-200, #d9f4c7) 0%,
      var(--green-300, #beefa7) 25%,
      var(--green-400, #7ed957) 60%,
      var(--green-500, #3b873f) 100%
    );
    opacity: 0.95;
  }

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    border-radius: 999px;
    padding: 8px 2px;
  }
`;

/** `$active`, `$tone` transient props 정의 */
const DotButton = styled.button<{ $active: boolean; $tone: string }>`
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  width: ${({ $active }) => ($active ? "54px" : "17px")};
  height: ${({ $active }) => ($active ? "auto" : "17px")};
  border-radius: 50%;

  background: ${({ $active, $tone }) =>
    $active ? "transparent" : `var(--green-${$tone}, var(--surface-1, #FFF))`};
  border: ${({ $active }) => ($active ? "none" : "2px solid rgba(0,0,0,0.02)")};

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    outline-offset: 2px;
    border-color: var(--primary-1);
  }
`;

const InnerDot = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

const FrogImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

const DotLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-1);
`;

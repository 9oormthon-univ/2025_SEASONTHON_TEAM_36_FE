import { CompletionLevel } from "@/common/types/enums";

import { COLOR_TONES, FROG_FACES } from "../constants/completionConstants";
import {
  DotButton,
  DotLabels,
  DotsRow,
  FrogImg,
  InnerDot,
  Wrapper,
} from "../styles/CompletionStyles";

/** CompletionLevel ↔ 점수(1~5) 매핑 */
const LEVELS: CompletionLevel[] = ["ZERO", "TWENTY_FIVE", "FIFTY", "SEVENTY_FIVE", "ONE_HUNDRED"];

export interface CompletionSelectorProps {
  name: string;
  value: CompletionLevel;
  onChange: (val: CompletionLevel) => void;
  leftLabel?: string;
  rightLabel?: string;
  className?: string;
}

/**
 * Selector (CompletionLevel 기반)
 * - ZERO ~ ONE_HUNDRED (5단계)
 * - 활성 버튼은 자리별 frog-face 아이콘 표시
 */
export default function CompletionSelector({
  name,
  value,
  onChange,
  leftLabel,
  rightLabel,
  className,
}: CompletionSelectorProps) {
  return (
    <Wrapper className={className}>
      <DotsRow role="radiogroup" aria-label={name} tabIndex={0}>
        {LEVELS.map((level, i) => {
          const n = i + 1;
          const active = level === value;
          const tone = COLOR_TONES[i] ?? "500";
          const faceSrc = FROG_FACES[n]; // 자리별 아이콘
          return (
            <DotButton
              key={level}
              type="button"
              role="radio"
              aria-checked={active}
              aria-label={`${level}`}
              $active={active}
              $tone={tone}
              onClick={() => onChange(level)}
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

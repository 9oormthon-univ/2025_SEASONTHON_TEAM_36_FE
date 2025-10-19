// src/pages/home/components/StepActionBtn.tsx
import styled from "styled-components";

import pauseIcon from "@/assets/images/pause.svg";
import playIcon from "@/assets/images/play.svg";

export interface StepActionBtnProps {
  /** 현재 재생 여부 */
  isPlaying?: boolean;
  onClick: () => void;
  /** 접근성 라벨(미지정 시 "시작"/"중지" 자동) */
  ariaLabel?: string;
  /** 아이콘 크기(px), 기본 29 */
  size?: number;
  /** 비활성화 여부 */
  disabled?: boolean;
}

export default function StepActionBtn({
  isPlaying = false,
  onClick,
  ariaLabel,
  size = 29,
  disabled = false,
}: StepActionBtnProps) {
  const iconSrc = isPlaying ? pauseIcon : playIcon;
  const label = ariaLabel ?? (isPlaying ? "중지" : "시작");

  return (
    <Btn type="button" aria-label={label} onClick={onClick} disabled={disabled}>
      <IconImg src={iconSrc} alt="" aria-hidden="true" $size={size} />
    </Btn>
  );
}

const Btn = styled.button`
  appearance: none;
  border: 0;
  cursor: pointer;
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

// $size 커스텀 prop 타입 지정
const IconImg = styled.img<{ $size: number }>`
  width: ${p => p.$size}px;
  height: ${p => p.$size}px;
  display: block;
`;

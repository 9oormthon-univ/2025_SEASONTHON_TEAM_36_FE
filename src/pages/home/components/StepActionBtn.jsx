import React from "react";
import styled from "styled-components";
import playIcon from "@/assets/images/play.svg";
import pauseIcon from "@/assets/images/pause.svg";

/**
 * StepActionButton
 * - isPlaying: boolean
 * - onClick: () => void
 * - ariaLabel?: string ("시작"/"중지" 자동 기본값)
 * - size?: number (기본 29)
 * - disabled?: boolean
 */
export default function StepActionBtn({
  isPlaying = false,
  onClick,
  ariaLabel,
  size = 29,
  disabled = false,
}) {
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

const IconImg = styled.img`
  width: ${(p) => p.$size}px;
  height: ${(p) => p.$size}px;
  display: block;
`;

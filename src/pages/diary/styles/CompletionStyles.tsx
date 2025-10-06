import styled from "styled-components";

import { DotButtonProps } from "../types/completionTypes";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7%;
`;

/* 트랙 라인 + 점 배치 줄 */
export const DotsRow = styled.div`
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
    padding: 8px 2px; /* 포커스 시 살짝 커져도 레이아웃 유지 */
  }
`;

/* 각 점 버튼 */
export const DotButton = styled.button<DotButtonProps>`
  position: relative;
  z-index: 1; /* 라인 위에 */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  /* 활성/비활성에 따라 크기/테두리 */
  width: ${p => (p.$active ? "54px" : "17px")};
  height: ${p => (p.$active ? "auto" : "17px")};
  border-radius: 50%;

  /* 비활성일 때만 작은 원 표시 (톤에 맞춰 색상 변화) */
  background: ${p =>
    p.$active ? "transparent" : `var(--green-${p.$tone}, var(--surface-1, #FFF))`};
  border: ${p => (p.$active ? "none" : "2px solid rgba(0,0,0,0.02)")}; /* 살짝 입체감 */

  &:active {
    transform: scale(0.96);
  }

  &:focus-visible {
    outline: 2px solid var(--primary-1);
    outline-offset: 2px;
    border-color: var(--primary-1);
  }
`;

/* 비활성 내부점(작은 점) */
export const InnerDot = styled.span`
  width: 100%;
  height: 100%;
  border-radius: 50%;
`;

/* 활성 상태에서 보이는 개구리 얼굴 (자리별) */
export const FrogImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;

/* 좌우 라벨 */
export const DotLabels = styled.div`
  display: flex;
  justify-content: space-between;
  color: var(--text-1);
`;

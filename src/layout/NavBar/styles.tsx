import styled, { css } from "styled-components";

/** 타입 정의 */
export type BarPosition = "sticky" | "fixed";
interface BarProps {
  /** 네비게이션 바 위치 전략 (기본: fixed) */
  $position?: BarPosition;
}

/** 각 아이템(링크) */
export const Item = styled.a`
  width: 100%;
  text-decoration: none;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;

  /* 라벨 기본색 */
  color: var(--text-2);
  transition:
    color 0.15s ease,
    transform 0.15s ease;

  /* 활성 시 라벨 컬러 */
  &[data-active="true"] {
    color: var(--text-1);
  }

  /* 호버 시 라벨 강조 */
  &:hover {
    color: var(--text-1);
  }
`;

/** 아이콘 이미지 (디자이너 제공 파일 사용) */
export const IconImg = styled.img`
  width: 22px;
  height: 22px;
  object-fit: contain;
  flex: 0 0 auto;
  pointer-events: none;
  transition:
    transform 0.15s ease,
    opacity 0.15s ease;

  /* 활성 상태 살짝 떠오르는 효과 */
  ${Item}[data-active="true"] & {
    transform: translateY(-1px);
  }
`;

export const Label = styled.span`
  user-select: none;
`;

/** 네비 바 */
export const Bar = styled.nav<BarProps>`
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;

  ${({ $position = "fixed" }) =>
    $position === "sticky"
      ? css`
          position: sticky;
        `
      : css`
          position: fixed;
        `}

  background: var(--bg-1);
  border-top: 1px solid var(--natural-400);
`;

/** 내부 컨테이너 */
export const Inner = styled.div`
  box-sizing: border-box;
  width: 100%;
  margin: 0 auto;
  padding: 16px 0 calc(34px + env(safe-area-inset-bottom, 0px));

  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: 1fr;
  justify-items: center;
  align-items: center;
`;

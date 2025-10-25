import styled, { keyframes } from "styled-components";

/**
 * Goal.tsx 컴포넌트 스타일
 */
export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media (max-height: 667px) {
    gap: 4px;
  }
`;

export const Row = styled.div<{ $detail: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 4px 4.5px;
  border-radius: 5px;
  box-shadow: ${props => (props.$detail ? "0px 0px 2px 1px rgba(0, 0, 0, 0.25)" : "0px")};
  box-shadow: 0px;
`;

export const StepContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const StepCheckBox = styled.div<{ $did: boolean }>`
  width: 23px;
  height: 23px;
  flex-shrink: 0;
  border: ${props => (props.$did ? "none" : "2px solid var(--natural-400)")};
  background-color: ${props => (props.$did ? "var(--green-100)" : "transparent")};
  border-radius: 4px;

  @media (max-height: 667px), (max-width: 375px) {
    width: 18px;
    height: 18px;
  }
`;

/**
 * StepManager.tsx 컴포넌트 스타일
 */
export const MoreButton = styled.button`
  background: none;
  border: none;
`;

export const StepManagerStyle = styled.div`
  display: flex;
  align-items: center;
`;

// 애니메이션 정의
const scaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
`;

export const StepManagerOptions = styled.div<{ $isShowing: boolean }>`
  display: flex;
  gap: 8px;
  pointer-events: ${props => (props.$isShowing ? "auto" : "none")};

  /* 마운트 시 자동으로 애니메이션 실행 */
  animation: ${scaleIn} 0.2s ease forwards;
  transform-origin: top right; /* 버튼 위치에 따라 조정 */
`;

export const StepManagerOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 8px;
  font-size: var(--fs-md);
  border-radius: 7px;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.25);
  cursor: pointer;
  white-space: nowrap;
  min-width: max-content;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05); /* 호버 효과 추가 */
  }
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 6.54px 0;
`;

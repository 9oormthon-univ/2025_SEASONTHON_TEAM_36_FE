import styled, { keyframes } from "styled-components";

/**
 * Goal.tsx 컴포넌트 스타일
 */
export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  @media (max-height: 667px) {
    gap: 8px;
  }
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 4.5px;
  border-radius: 5px;
  position: relative;
`;

export const StepContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
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

export const StepManagerStyle = styled.div``;

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
  flex-direction: column;
  border-radius: 10.9px;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.25);
  padding: 9.81px 7.63px;
  pointer-events: ${props => (props.$isShowing ? "auto" : "none")};
  background: white;
  /* 마운트 시 자동으로 애니메이션 실행 */
  animation: ${scaleIn} 0.2s ease forwards;
  transform-origin: top right; /* 버튼 위치에 따라 조정 */
  position: absolute;
  top: 28px;
  right: 0px;
  z-index: 1;
`;

export const StepManagerOption = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  font-size: var(--fs-sm);
  cursor: pointer;
  white-space: nowrap;
  min-width: max-content;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05); /* 호버 효과 추가 */
  }

  @media (min-width: 414px) {
    font-size: var(--fs-md);
    gap: 32px;
  }
`;

export const MoreButton = styled.button`
  display: flex;
  background: none;
  border: none;
  position: absolute;
  right: 0px;
  top: 2.5px;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 6.54px 0;
`;

export const ModifyImg = styled.img`
  width: 16px;
  height: 16px;
  margin-right: 2px;
  @media (min-width: 414px) {
    width: 17.433px;
    height: 17.433px;
  }
`;

export const DeleteImg = styled.img`
  width: 20px;
  height: 20px;
  @media (min-width: 414px) {
    width: 22px;
    height: 22px;
  }
`;

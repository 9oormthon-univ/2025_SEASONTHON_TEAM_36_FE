import styled from "styled-components";

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

export const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 4px 4.5px;
`;

export const StepContent = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const StepCheckBox = styled.div<{ $did: boolean }>`
  width: 23px;
  height: 23px;
  margin-right: 16px;
  border: ${props => (props.$did ? "none" : "2px solid var(--natural-400)")};
  background-color: ${props => (props.$did ? "var(--green-100)" : "transparent")};
  border-radius: 4px;
  @media (max-height: 667px) {
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
  position: relative;
  margin-left: 10.5px;
`;

export const StepManagerOptions = styled.div<{ $isShowing: boolean }>`
  display: flex;
  background-color: white;
  position: absolute;
  width: 120px;
  flex-direction: column;
  left: -95px;
  border-radius: 10.9px;
  padding: 7.63px 9.81px;
  box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.25);
  transform: ${props => (props.$isShowing ? "scale(1)" : "scale(0.9)")};
  opacity: ${props => (props.$isShowing ? 1 : 0)};
  transform-origin: top;
  transition:
    transform 0.1s ease-out,
    opacity 0.1s ease-out;
  pointer-events: ${props => (props.$isShowing ? "auto" : "none")};
  z-index: 51;
`;

export const StepManagerOption = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 3px 4px 3px 0;
  font-size: var(--fs-md);
  cursor: pointer;
`;

export const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
  margin: 6.54px 0;
`;

import styled from "styled-components";

/**
 * ToDoList.tsx 스타일
 */
export const ToDo = styled.div`
  padding: 0 26px 90px 26px;
`;

/**
 * Goal.tsx 스타일
 */
export const GoalStyle = styled.div`
  margin-top: 16px;
`;

export const GoalContainer = styled.div`
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  background-color: var(--green-200);
  border-radius: 10px;
  margin-bottom: 15px;
  padding: 4px 10px;
`;

export const GoalName = styled.span`
  font-size: var(--fs-xs);
  @media (max-height: 667px) {
    font-size: 11px;
  }
`;

/**
 * GoalDeadline.tsx 스타일
 */
export const GoalDeadlineStyle = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 56px 37px;
`;

export const SizedBox = styled.div<{ $height: number }>`
  height: ${props => props.$height}px;
`;

export const StepList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 100%;
  height: 353px;
  overflow: auto; /* 세로 스크롤 */
  padding: 5px; /* 그림자가 잘리지 않게 여백 */

  /* 스크롤바 커스터마이징 (옵션) */
  &::-webkit-scrollbar {
    display: none;
  }
`;

export const StepStyle = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  border-radius: 16px;
  padding: 10px 24px;
  box-shadow:
    0.3px 0.3px 5px 0 var(--natural-400),
    -0.3px -0.3px 5px 0 var(--natural-400);
`;

export const StepDate = styled.span`
  display: block;
  margin-top: 4px;
  margin-left: 5px;
  color: var(--text-2);
  font-size: var(--fs-sm);
`;

export const StepContent = styled.div`
  display: flex;
  justify-content: space-between;
`;

/**
 * GoalList.tsx 스타일
 */
export const GoalListStyle = styled.div`
  padding: 2px 10px;
  padding-bottom: 76px;
`;

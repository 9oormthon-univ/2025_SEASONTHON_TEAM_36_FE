import styled from "styled-components";

export const GoalInfoStyle = styled.div`
  display: flex;
  width: 100%;
  padding: 30px 9px;
  flex-direction: column;
  gap: 23px;
  flex-shrink: 0;
  border-radius: 40px;
  background: var(--bg-1, #fff);
  box-shadow:
    -0.3px -0.3px 5px 0 var(--natural-400, #d6d9e0),
    0.3px 0.3px 5px 0 var(--natural-400, #d6d9e0);
  text-align: center;
`;

export const Goal = styled.div`
  padding: 0px 24px;
`;

export const RowOne = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

export const Success = styled.div`
  background: var(--green-200);
  borderradius: 2px;
  width: 12px;
  height: 12px;
  margin-right: 12px;
`;

export const RowTwo = styled.div`
  display: flex;
  justify-content: space-around;
`;

export const Date = styled.span`
  font-size: var(--fs-sm);
`;
export const Time = styled.span`
  color: var(--green-500);
  font-size: var(--fs-sm);
`;

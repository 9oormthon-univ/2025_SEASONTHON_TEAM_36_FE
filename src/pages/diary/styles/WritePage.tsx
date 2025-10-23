import styled from "styled-components";

export const Page = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 35px;
  padding: 16px 24px;
  background: var(--bg-1);
  color: var(--text-1);
  box-sizing: border-box;
  overflow-x: hidden;
`;

export const DateBar = styled.h3`
  position: sticky;
  top: 0;
  background: var(--bg-1);
  padding: 10px 0 12px;
  text-align: center;
  color: var(--text-1, #000);
`;

export const DateText = styled.div`
  margin: 0;
  color: var(--text-1);
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const Label = styled.span`
  color: var(--text-1);
  margin: 10px 0;
`;

export const Selected = styled.div`
  padding: 8px 2px;
  border-radius: 8px;
  border: 1px solid var(--natural-400);
  font-size: var(--fs-md);
`;

export const CompletionRow = styled.div`
  display: flex;
  flex-direction: column; /* 세로로 쌓기 */
  width: 100%; /* 부모 가로 전체 */
  align-items: stretch; /* 내부 요소도 가로 꽉 차도록 */
  gap: 8px;
`;

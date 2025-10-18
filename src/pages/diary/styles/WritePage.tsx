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

export const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

export const Legend = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 0 14px;
`;

export const LegendItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
  padding: 2px 0;
`;

export const LegendLeft = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 20px;
  min-width: 0; /* ellipsis를 위해 필요 */
  > span {
    color: var(--text-1);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 64vw; /* 이름이 길 때 줄바꿈 대신 말줄임 */
  }
`;

// const LegendRight = styled.span`
//   color: var(--text-2);
//   white-space: nowrap;
// `;

export const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
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

export const PhotoBox = styled.div`
  width: 100%;
  height: 150px;
  background: var(--natural-400);
  border: 1px solid var(--natural-400);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  margin-bottom: 50px;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: cover;
  }
`;

export const Placeholder = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.6;
`;

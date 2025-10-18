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

export const DateBar = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background: var(--grey-800);
  border-radius: 1rem;
`;

export const DateText = styled.h2`
  margin: 0;
  color: var(--text-1);
`;

export const ChartBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const MemoFieldWrap = styled.div`
  position: relative;
  padding: 6px 0 10px; /* 아래 여백으로 밑줄과 간격 */
  border-bottom: 1px solid var(--natural-400);
  transition: border-color 150ms ease;
  &:focus-within {
    border-bottom-color: var(--primary-1); /* 포커스 시 강조 */
  }
`;

export const MemoInput = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  color: var(--text-1);
  font-family: var(--ff-sans);
  font-size: var(--fs-sm);
  line-height: 1.4;
  resize: none; /* 필요시 vertical로 변경 */
  box-sizing: border-box;
  padding-right: 56px; /* 우측 카운터 자리 */
  /* iOS 확대 방지 */
  -webkit-text-size-adjust: 100%;

  ::placeholder {
    color: var(--text-3);
  }
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

export const ColorDot = styled.span`
  width: 12px;
  height: 12px;
  border-radius: 2px;
`;

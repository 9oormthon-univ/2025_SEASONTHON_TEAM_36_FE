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

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

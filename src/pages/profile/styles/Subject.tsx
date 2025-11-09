import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 0 1rem;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  touch-action: manipulation;
  user-select: none;
`;

export const Icon = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  svg {
    width: 100%;
    height: 100%;
  }

  .clicked > path {
    stroke: var(--green-500);
  }

  .clicked > circle {
    stroke: var(--green-500);
  }
`;

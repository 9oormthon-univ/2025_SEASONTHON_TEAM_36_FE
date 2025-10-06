import styled from "styled-components";

export const Card = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
`;

export const Title = styled.div`
  color: var(--text-1);
`;

export const ImageWrapper = styled.div`
  width: 56px;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
  }
`;

export const Label = styled.span`
  color: var(--text-1);
  margin: 10px 0;
`;

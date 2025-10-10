import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 70%;
  margin-top: 16px;
  @media (max-height: 800px) {
    margin-top: 12px;
  }

  @media (max-height: 700px) {
    margin-top: 8px;
  }

  @media (max-height: 600px) {
    margin-top: 4px;
  }

  @media (max-height: 500px) {
    margin-top: 0px;
  }
`;

export const Month = styled.h1`
  color: white;
  font-size: clamp(var(--fs-lg), 5vw, var(--fs-xl));
`;

export const ButtonImg = styled.img`
  display: block;
  margin-bottom: 1px;
  width: clamp(18px, 6vw, 24px);
`;

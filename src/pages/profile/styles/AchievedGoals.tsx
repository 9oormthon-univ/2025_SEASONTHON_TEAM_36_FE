import styled from "styled-components";

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  margin-bottom: 20px;
`;

export const Subjects = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: center;
`;

export const Subject = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  padding: 0 1rem;
  cursor: pointer;
`;

export const Icon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  @media (max-width: 375px) {
    width: 42px;
    height: 42px;
  }
`;

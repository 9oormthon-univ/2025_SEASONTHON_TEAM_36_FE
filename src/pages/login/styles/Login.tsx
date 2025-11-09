import styled, { keyframes } from "styled-components";

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

export const Screen = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16%;
  height: 100%;
  padding-bottom: 24px;
  animation: ${fadeIn} 1.5s forwards;
`;

export const AppLogos = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const AppLogo = styled.img`
  width: 80%;
  max-width: 260px;
`;

export const AppTitle = styled.img`
  width: 80%;
  max-width: 224px;
`;

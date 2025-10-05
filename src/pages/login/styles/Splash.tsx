import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
	0% {
		opacity: 1;
	}
	50% {
		opacity: 1;
	}
	100% {
		opacity: 0;
	}
`;

export const SizedBox = styled.div`
  margin-top: 108px;
`;

export const Cheer = styled.h3`
  margin-top: 31px;
  color: #6f737b;
  font-size: 24px;
  font-weight: 500;
`;

export const Screen = styled.div<{ $show: boolean }>`
  display: ${props => (props.$show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  animation: ${fadeOut} 1.5s forwards;
  position: absolute;
  background-color: white;
`;

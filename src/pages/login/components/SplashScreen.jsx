import styled, { keyframes } from "styled-components";

import CheerSentence from "../components/CheerSentence";
import AppLogoWell from "./AppLogoWell";
import AppTitle from "./AppTitle";

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

const SplashScreenStyle = styled.div`
  display: ${props => (props.$show ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  animation: ${fadeOut} 1.5s forwards;
  position: absolute;
  background-color: white;
`;

const SplashScreen = ({ show }) => {
  return (
    <SplashScreenStyle $show={show}>
      <AppTitle width="317" />
      <CheerSentence>넌 이미 잘하고 있어.</CheerSentence>
      <AppLogoWell />
    </SplashScreenStyle>
  );
};

export default SplashScreen;

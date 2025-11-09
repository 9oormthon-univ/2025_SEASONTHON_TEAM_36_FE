import styled from "styled-components";

import AppLogoWellImg from "../../../assets/images/app-logo-well.png";
import SplashScreenAppTitle from "../../../assets/images/app-title.png";
import { Cheer, Screen, SizedBox } from "../styles/Splash";

const SplashAppTitle = styled.img`
  width: 100%;
  max-width: 317px;
`;

const SplashAppLogo = styled.img`
  width: 100%;
  max-width: 600px;
`;

const SplashScreen = ({ show }: { show: boolean }) => {
  return (
    <Screen $show={show}>
      <SizedBox />
      <SplashAppTitle
        src={SplashScreenAppTitle as string}
        alt="우물 밖 개구리"
        width="317"
        loading="lazy"
      />
      <Cheer>넌 이미 잘하고 있어.</Cheer>
      <SplashAppLogo src={AppLogoWellImg as string} alt="우물 밖 개구리" loading="lazy" />
    </Screen>
  );
};

export default SplashScreen;

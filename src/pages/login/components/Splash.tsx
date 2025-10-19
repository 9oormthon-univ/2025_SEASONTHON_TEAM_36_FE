import AppLogoWellImg from "../../../assets/images/app-logo-well.png";
import SplashScreenAppTitle from "../../../assets/images/app-title.png";
import { Cheer, Screen, SizedBox } from "../styles/Splash";

const SplashScreen = ({ show }: { show: boolean }) => {
  return (
    <Screen $show={show}>
      <SizedBox />
      <img src={SplashScreenAppTitle} alt="우물 밖 개구리" width="317" />
      <Cheer>넌 이미 잘하고 있어.</Cheer>
      <img src={AppLogoWellImg} alt="우물 밖 개구리" width={window.innerWidth} />
    </Screen>
  );
};

export default SplashScreen;

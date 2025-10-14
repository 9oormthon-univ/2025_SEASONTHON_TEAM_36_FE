import kakaoLoginImg from "@/assets/images/kakao-login-medium-wide.svg";

import AppLogoImg from "../../../assets/images/app-logo-frog.png";
import AppTitleImg from "../../../assets/images/app-title.png";
import { AppLogos, Screen } from "../styles/Login";

const LoginScreen = () => {
  return (
    <Screen>
      <AppLogos>
        <img src={AppLogoImg} alt="개구리 얼굴" width="262" />
        <img src={AppTitleImg} alt="우물 밖 개구리" width="224" />
      </AppLogos>
      <button
        onClick={() => {
          window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
        }}
      >
        <img src={kakaoLoginImg} alt="카카오 로그인" />
      </button>
    </Screen>
  );
};

export default LoginScreen;

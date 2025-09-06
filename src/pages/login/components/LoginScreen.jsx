import styled from "styled-components";

import AppLogos from "./AppLogos";
import KakaoLoginButton from "./KakaoLoginButton";

const LoginScreenStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const LoginScreen = () => {
  return (
    <LoginScreenStyle>
      <AppLogos />
      <KakaoLoginButton />
    </LoginScreenStyle>
  );
};

export default LoginScreen;

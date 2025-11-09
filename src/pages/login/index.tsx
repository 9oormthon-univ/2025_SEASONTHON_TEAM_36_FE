import styled from "styled-components";

import Login from "./components/Login";
import Splash from "./components/Splash";
import { useSplashScreen } from "./hooks/useSplashScreen";

const Page = styled.div`
  position: relative;
  height: 100vh;
`;

const LoginScreen = () => {
  const showing = useSplashScreen();

  return (
    <Page>
      <Splash show={showing} />
      <Login />
    </Page>
  );
};

export default LoginScreen;

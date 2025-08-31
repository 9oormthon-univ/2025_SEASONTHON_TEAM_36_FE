import { useEffect, useState } from 'react';
import SplashScreen from './components/SplashScreen';
import LoginScreen from './components/LoginScreen';
import styled from 'styled-components';

const LoginStyle = styled.div`
  position: relative;
`;

const Login = () => {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // 1초 동안 스플래시 유지 후 로그인 화면 표시
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LoginStyle>
      <SplashScreen show={showSplash}>스플래시 화면</SplashScreen>
      <LoginScreen>로그인 화면</LoginScreen>
    </LoginStyle>
  );
};

export default Login;

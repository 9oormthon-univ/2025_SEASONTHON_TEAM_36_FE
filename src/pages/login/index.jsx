import styled from 'styled-components';
import AppLogos from './components/AppLogos';
import KakaoLoginButton from './components/KakaoLoginButton';

const LoginStyle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Login = () => {
  return (
    <LoginStyle>
      <AppLogos />
      <KakaoLoginButton />
    </LoginStyle>
  );
};

export default Login;

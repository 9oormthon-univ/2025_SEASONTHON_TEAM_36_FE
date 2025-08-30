import { Link } from 'react-router-dom';
import styled from 'styled-components';

const KakaoLoginButtonStyle = styled.button`
  background-color: #fffb00;
  border: none;
  border-radius: 24px;
  padding: 16px 90px;
  font-size: 16px;
`;

const KakaoLoginButton = () => {
  return (
    <KakaoLoginButtonStyle
      onClick={() => {
        
      }}
    >
      <Link to="/signup/done">카카오로 시작하기</Link>
    </KakaoLoginButtonStyle>
  );
};

export default KakaoLoginButton;

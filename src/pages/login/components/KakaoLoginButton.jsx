import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { setCookie } from '../../../common/utils/cookie';

const KakaoLoginButtonStyle = styled.button`
  background-color: #fffb00;
  border: none;
  border-radius: 24px;
  padding: 16px 90px;
  font-size: 16px;
`;

const KakaoLoginButton = () => {
  const navigate = useNavigate();
  return (
    <KakaoLoginButtonStyle
      onClick={() => {
        setCookie('access-token', 'accesstoken', 3600);
        navigate('/signup/done');
      }}
    >
      카카오로 시작하기
    </KakaoLoginButtonStyle>
  );
};

export default KakaoLoginButton;

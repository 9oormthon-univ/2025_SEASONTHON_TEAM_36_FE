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
        window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
          import.meta.env.VITE_KAKAO_REST_API_KEY
        }&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;
      }}
    >
      카카오로 시작하기
    </KakaoLoginButtonStyle>
  );
};

export default KakaoLoginButton;

import kakaoLoginImg from '@/assets/images/kakao-login-medium-wide.svg';

const KakaoLoginButton = () => {
  return (
    <button
      onClick={() => {
        // window.location.href = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${
        //   import.meta.env.VITE_KAKAO_REST_API_KEY
        // }&redirect_uri=${import.meta.env.VITE_KAKAO_REDIRECT_URI}`;
        window.location.href = `${import.meta.env.VITE_API_BASE_URL}/oauth2/authorization/kakao`;
      }}
    >
      <img src={kakaoLoginImg} alt="카카오 로그인" />
    </button>
  );
};

export default KakaoLoginButton;

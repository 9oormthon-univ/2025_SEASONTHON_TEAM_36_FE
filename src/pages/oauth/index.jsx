import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

// import requestKakaoTokens from '../../apis/requestKakaoTokens';
import { setCookie } from '../../common/utils/cookie';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessToken = searchParams.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      setCookie("access_token", accessToken, 3600 * 7);
      setToken(token);
    }
    setLoading(false);
  }, [accessToken, token]);
  if (!loading) {
    if (token) return <Navigate to="/signup/done" />;
    return "인증 실패...";
  }
  return "카카오 인증 진행";
};

export default OAuthCallback;

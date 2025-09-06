import { useEffect, useState } from 'react';
import { Navigate, useSearchParams } from 'react-router-dom';

import requestKakaoTokens from '../../apis/requestKakaoTokens';
import { setCookie } from '../../common/utils/cookie';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [tokens, setTokens] = useState(null);
  const code = searchParams.get('code');

  useEffect(() => {
    const apiRequest = async code => {
      const data = await requestKakaoTokens(code);
      setTokens(data);
      setIsLoading(false);
    };
    apiRequest(code);
  }, []);

  useEffect(() => {
    if (tokens) {
      if (tokens.access_token && tokens.expires_in) {
        setCookie('access_token', tokens.access_token, tokens.expires_in);
      }
      if (tokens.refresh_token && tokens.refresh_token_expires_in) {
        setCookie('refresh_token', tokens.refresh_token, tokens.refresh_token_expires_in);
      }
    }
  }, [tokens]);
  if (!isLoading) {
    if (tokens) return <Navigate to="/signup/done" />;
    return '인증 실패...';
  }
  return '카카오 인증 진행';
};

export default OAuthCallback;

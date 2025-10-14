import { Navigate } from "react-router-dom";

import { useGetToken } from "./hooks/useGetToken";

const OAuthCallback = () => {
  const [token, loading] = useGetToken();
  if (!loading) {
    if (token) return <Navigate to="/signup/done" />;
    return "인증 실패...";
  }
  return "카카오 인증 진행";
};

export default OAuthCallback;

import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { setCookie } from "@/common/utils/cookie";

export const useGetToken = () => {
  const [searchParams] = useSearchParams();
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const accessToken: string | null = searchParams.get("accessToken");

  useEffect(() => {
    if (accessToken) {
      setCookie("access_token", accessToken, 3600 * 7);
      setToken(accessToken);
    }
    setLoading(false);
  }, [accessToken, token]);

  return [token, loading];
};

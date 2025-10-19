import axios from "axios";

import { ErrorResponse } from "@/common/types/error";

import { handleApiRequest } from "./apiUtils";

/**
 * 카카오 OAuth 토큰 응답 타입 정의
 * @see https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#request-token
 */
export interface KakaoTokenResponse {
  /** 토큰 타입, bearer로 고정 */
  token_type: string;
  /** 사용자 액세스 토큰 값 */
  access_token: string;
  /** 액세스 토큰 만료 시간(초) */
  expires_in: number;
  /** 사용자 리프레시 토큰 값 */
  refresh_token: string;
  /** 리프레시 토큰 만료 시간(초) */
  refresh_token_expires_in: number;
  /** 인증된 사용자의 정보 조회 권한 범위 */
  scope?: string;
  /** OpenID Connect 확장 기능을 통해 발급되는 ID 토큰 */
  id_token?: string;
}

/**
 * 카카오 인가코드를 이용해 액세스 토큰과 리프레시 토큰을 요청합니다
 * @param code 인가 코드 받기 요청으로 얻은 인가 코드
 * @returns 카카오 OAuth 토큰 응답 객체 또는 에러 발생 시 undefined
 */
const requestKakaoTokens = async (code: string) => {
  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", import.meta.env.VITE_KAKAO_REST_API_KEY as string);
  params.append("redirect_uri", import.meta.env.VITE_KAKAO_REDIRECT_URI as string);
  params.append("code", code);

  return handleApiRequest<KakaoTokenResponse>(() =>
    axios.post("https://kauth.kakao.com/oauth/token", params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    }),
  );
};

export default requestKakaoTokens;

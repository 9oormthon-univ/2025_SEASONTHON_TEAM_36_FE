// src/apis/user.ts
import type { EditUserProfileReq, RespUserProfile } from "@/common/types/response/user";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

const BASE = "/api/v1/users";

/** GET /api/v1/users/my-page - 로그인한 회원 정보 조회 */
export const getUserProfile = async () => {
  return handleApiRequest<RespUserProfile>(() => mainApi.get(`${BASE}/my-page`));
};

/** PUT /api/v1/users/my-page - 회원 정보 수정 (age/school/grade 일부만 보내도 됨) */
export const editUserProfile = async (data: EditUserProfileReq) => {
  return handleApiRequest<RespUserProfile>(() => mainApi.put(`${BASE}/my-page`, data));
};

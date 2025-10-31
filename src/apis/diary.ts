import type { RespDiary, RespDiaryDetail } from "@/common/types/response/diary";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

const BASE = "/api/v1/diaries";

/** [GET] 특정 달의 Diary 조회 (쿼리 파라미터: yearMonth -> "yyyy-MM" 형식) */
export const fetchDiaryOfMonth = (yearMonth: string) => {
  return handleApiRequest<RespDiary[]>(() => mainApi.get(`${BASE}?yearMonth=${yearMonth}`));
};

/** [GET] 특정 달의 Diary 상세 조회 (쿼리 파라미터: date -> "yyyy-MM-dd" 형식) */
export const fetchDiaryDetail = (date: string) => {
  return handleApiRequest<RespDiaryDetail>(() => mainApi.get(`${BASE}/detail?date=${date}`));
};

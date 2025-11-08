import type { RespDiary, RespDiaryDetail, TodayCompletedTodo } from "@/common/types/response/diary";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

const BASE = "/api/v1/diaries";

/** [GET] 특정 달의 Diary 조회 (쿼리 파라미터: yearMonth -> "yyyy-MM" 형식) */
export const fetchDiaryOfMonth = (yearMonth: string) => {
  return handleApiRequest<RespDiary[]>(() =>
    mainApi.get(`${BASE}`, {
      params: { yearMonth },
    }),
  );
};

/** [GET] 특정 날짜의 Diary 상세 조회 (쿼리 파라미터: date -> "yyyy-MM-dd" 형식) */
export const fetchDiaryDetail = (date: string) => {
  return handleApiRequest<RespDiaryDetail>(() =>
    mainApi.get(`${BASE}/detail`, {
      params: { date }, // 쿼리 파라미터 안전하게 전달
      headers: { Accept: "application/json" },
    }),
  );
};

/** [GET] 특정 날짜의 todayCompletedTodoResponses 조회 */
export const fetchCompletedTodos = (date: string) => {
  return handleApiRequest<TodayCompletedTodo[]>(() =>
    mainApi.get(`${BASE}/today`, {
      params: { date }, // 쿼리 파라미터 안전하게 전달
      headers: { Accept: "application/json" },
    }),
  );
};

import { Todo } from "@/common/types/enums";
import {
  RespAchievementRate,
  RespFocusTime,
  RespMonthlyTodos,
} from "@/common/types/response/statistics";

import mainApi from ".";
import { handleApiRequest } from "./apiUtils";

const BASE = "/api/v1/statistics";

/** [GET] 이번 달 달성 과제 목록 조회 (쿼리 파라미터: yearMonth -> string, "yyyy-MM" 형식 | todoType -> string) */
export const fetchMonthlyTodos = (yearMonth: string, todoType: Todo) => {
  return handleApiRequest<RespMonthlyTodos[]>(() =>
    mainApi.get(`${BASE}/todos/monthly?yearMonth=${yearMonth}&todoType=${todoType}`),
  );
};

/** [GET] 집중 시간 조회 (쿼리 파라미터: yearMonth -> string, "yyyy-MM" 형식) */
export const fetchFocusTime = (yearMonth: string) => {
  return handleApiRequest<RespFocusTime[]>(() =>
    mainApi.get(`${BASE}/focus-time?yearMonth=${yearMonth}`),
  );
};

/** [GET] 달성률 변화 추이 조회 (쿼리 파라미터: yearMonth -> string, "yyyy-MM" 형식) */
export const fetchAchievementRate = (yearMonth: string) => {
  return handleApiRequest<RespAchievementRate[]>(() =>
    mainApi.get(`${BASE}/achievement-rate?yearMonth=${yearMonth}`),
  );
};

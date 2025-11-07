import { ErrorResponse } from "@/common/types/error";
import type { ReqDailyLogAfter, ReqDailyLogBefore } from "@/common/types/request/dailyLog";
import type { RespDailyLogAfter, RespDailyLogBefore } from "@/common/types/response/dailyLog";

import { handleApiRequest } from "./apiUtils";
import mainApi from "./index";

/** [POST] 오늘 DailyLogBefore 생성 */
export async function createDailyLogBefore(
  body: ReqDailyLogBefore,
): Promise<RespDailyLogBefore | ErrorResponse | string> {
  return handleApiRequest<RespDailyLogBefore>(() => mainApi.post("/api/v1/daily-log/before", body));
}

/** [GET] 오늘 DailyLogBefore 조회 */
export async function getTodayDailyLogBefore() {
  return handleApiRequest<RespDailyLogBefore>(() =>
    mainApi.get("/api/v1/daily-log/before/today", {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [GET] 특정 날짜 DailyLogBefore 조회 */
export async function getDailyLogBefore(date: string) {
  return handleApiRequest<RespDailyLogBefore | null>(() =>
    mainApi.get("/api/v1/daily-log/before/date", {
      params: { date },
      headers: { Accept: "application/json" },
    }),
  );
}

/** [POST] 특정 날짜 DailyLogAfter 생성 (사진 URL 포함 가능) */
export async function createDailyLogAfter(
  body: ReqDailyLogAfter,
  date: string,
): Promise<RespDailyLogAfter | ErrorResponse | string> {
  return handleApiRequest<RespDailyLogAfter>(() =>
    mainApi.post("/api/v1/daily-log/after/date", body, {
      params: { date },
    }),
  );
}

/** [GET] 오늘 DailyLogAfter 조회 */
// export async function getDailyLogAfterToday() {
//   return handleApiRequest<RespDailyLogAfter>(() =>
//     mainApi.get("/api/v1/daily-log/after/today", {
//       headers: { Accept: "application/json" },
//     }),
//   );
// }

// 추후 통계 관련 GET api 구현

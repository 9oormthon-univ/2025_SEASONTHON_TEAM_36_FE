import { useCallback, useEffect, useRef, useState } from "react";

import { fetchCompletedTodos } from "@/apis/diary";
import { getDailyLogBefore } from "@/apis/diaryLog";
import type { ErrorResponse } from "@/common/types/error";
import { RespDailyLogBefore } from "@/common/types/response/dailyLog";

import { GoalForChart, mapTodosToChartGoals } from "../utils/diaryUtils";

/** handleApiRequest가 string | ErrorResponse를 리턴할 수 있으므로 가드 */
function isErrorResponse(x: unknown): x is ErrorResponse {
  return !!x && typeof x === "object" && "message" in x && "code" in x;
}

export type UseWriteDetailResult = {
  before: RespDailyLogBefore | null; // [GET] DailyLogBefore (null 가능)
  goals: GoalForChart[]; // [GET] 완료된 투두
  loading: boolean;
  error: string | null;
  reload: () => void; // 최신 날짜 기준 재호출
};

export function useWriteDetail(date?: string | null): UseWriteDetailResult {
  const [before, setBefore] = useState<RespDailyLogBefore | null>(null);
  const [goals, setGoals] = useState<GoalForChart[]>([]);
  const [loading, setLoading] = useState<boolean>(!!date);
  const [error, setError] = useState<string | null>(null);

  const latestDateRef = useRef<string | null>(date ?? null);

  const load = useCallback(async (d = latestDateRef.current) => {
    if (!d) return;

    setLoading(true);
    setError(null);

    try {
      // 두 API를 병렬 호출
      const [beforeRes, todosRes] = await Promise.all([
        getDailyLogBefore(d),
        fetchCompletedTodos(d),
      ]);

      // ---- DailyLogBefore 결과 처리 ----
      if (typeof beforeRes === "string") {
        setError(beforeRes || "DailyLogBefore 요청 중 문제가 발생했습니다.");
        setBefore(null);
      } else if (isErrorResponse(beforeRes)) {
        setError(beforeRes.message || "DailyLogBefore 요청에 실패했습니다.");
        setBefore(null);
      } else {
        setBefore(beforeRes); // null 허용
      }

      // ---- CompletedTodos 결과 처리 ----
      if (typeof todosRes === "string") {
        // 에러가 이미 있을 수도 있으니 이어붙임
        setError(prev => prev ?? (todosRes || "완료된 투두 조회 중 문제가 발생했습니다."));
        setGoals([]);
      } else if (isErrorResponse(todosRes)) {
        setError(prev => prev ?? (todosRes.message || "완료된 투두 요청에 실패했습니다."));
        setGoals([]);
      } else {
        setGoals(mapTodosToChartGoals(todosRes));
      }
    } catch {
      setError(prev => prev ?? "네트워크 오류가 발생했어요. 잠시 후 다시 시도해주세요.");
      setBefore(null);
      setGoals([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // 날짜가 바뀌면 재로딩
  useEffect(() => {
    latestDateRef.current = date ?? null;

    if (!date) {
      setBefore(null);
      setGoals([]);
      setLoading(false);
      setError(null);
      return;
    }

    void load(date);
  }, [date, load]);

  const reload = useCallback(() => {
    void load();
  }, [load]);

  return { before, goals, loading, error, reload };
}

export default useWriteDetail;

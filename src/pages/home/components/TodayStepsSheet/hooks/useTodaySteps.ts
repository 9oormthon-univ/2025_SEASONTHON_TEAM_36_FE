// src/pages/home/hooks/useTodaySteps.ts
import { useCallback, useEffect, useState } from "react";

import { fetchTodaySteps } from "@/apis/step";
import type { RespTodayStep } from "@/common/types/response/step";

/**
 * /api/v1/steps/one-step
 * 오늘/놓친 한 걸음 리스트를 그대로 반환하는 훅 (서버 데이터 그대로 사용)
 */
export function useTodaySteps(goalId?: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<RespTodayStep>({
    todayStepResponses: [],
    missedStepResponses: [],
  });

  const refetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = (await fetchTodaySteps()) as RespTodayStep;
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // goalId가 바뀌면 다시 로드 (현재 API는 goalId 미사용) TODO, 추후 goalId 반영
    void refetch();
  }, [goalId, refetch]);

  return { loading, error, data, refetch };
}

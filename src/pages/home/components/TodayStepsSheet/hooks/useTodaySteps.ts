// src/pages/home/hooks/useTodaySteps.ts
import { useCallback, useEffect, useState } from "react";

import { fetchTodaySteps } from "@/apis/step";
import type { RespTodayStep } from "@/common/types/response/step";

/**
 * /api/v1/steps/one-step/{todoId}
 * 오늘/놓친 한 걸음 리스트를 그대로 반환하는 훅
 */
export function useTodaySteps(todoId?: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);
  const [data, setData] = useState<RespTodayStep>({
    todayStepResponses: [],
    missedStepResponses: [],
  });

  const refetch = useCallback(async () => {
    if (todoId == null) {
      // 필수 파라미터 부재 시 초기화만 수행
      setData({ todayStepResponses: [], missedStepResponses: [] });
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const result = (await fetchTodaySteps(todoId)) as RespTodayStep;
      setData(result);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { loading, error, data, refetch };
}

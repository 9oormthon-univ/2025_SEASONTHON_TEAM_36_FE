// src/pages/home/hooks/useFetchSteps.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { fetchSteps } from "@/apis/step";
import type { RespTodoSteps } from "@/common/types/response/step";
import type { GoalStepsView, TodayPastLists } from "@/pages/home/types/steps";

import { toGoalStepsView, toTodayAndPastLists, toTodayStepsView } from "../utils/stepsView";

/**
 * goalId 기준으로 step 데이터를 가져오고, 다양한 뷰(원본/전체/오늘/오늘+과거)를 메모이즈해서 제공합니다.
 */
export function useFetchSteps(goalId?: number | null): {
  raw: RespTodoSteps | null;
  view: GoalStepsView;
  todayView: GoalStepsView;
  lists: TodayPastLists;
  loading: boolean;
  error: unknown;
  reload: () => Promise<void>;
} {
  const [raw, setRaw] = useState<RespTodoSteps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  // 언마운트 뒤 setState 방지용 플래그
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const reload = useCallback(async () => {
    // goalId가 없으면 요청하지 않음
    if (goalId == null) return;
    try {
      setLoading(true);
      setError(null);
      const data = (await fetchSteps(goalId)) as RespTodoSteps;
      if (alive.current) setRaw(data);
    } catch (e) {
      if (alive.current) setError(e);
    } finally {
      if (alive.current) setLoading(false);
    }
  }, [goalId]);

  // goalId 바뀔 때 자동 로드
  useEffect(() => {
    void reload();
  }, [reload]);

  // 파생 뷰들 메모이즈
  const view = useMemo<GoalStepsView>(() => toGoalStepsView(raw), [raw]);
  const todayView = useMemo<GoalStepsView>(() => toTodayStepsView(raw), [raw]);
  const lists = useMemo<TodayPastLists>(() => toTodayAndPastLists(raw), [raw]);

  return { raw, view, todayView, lists, loading, error, reload };
}

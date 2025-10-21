import { useCallback, useEffect, useMemo, useRef } from "react";

import { fetchSteps } from "@/apis/step";
import type { RespTodoSteps } from "@/common/types/response/step";
import { useStepsStore } from "@/pages/home/store/useStepsStore";
import type { GoalStepsView, TodayPastLists } from "@/pages/home/types/steps";

import { toGoalStepsView, toTodayAndPastLists, toTodayStepsView } from "../utils/stepsView";

/**
 * goalId 기준으로 step 데이터를 가져오고, 다양한 뷰(원본/전체/오늘/오늘+과거)를 메모이즈해서 제공합니다.
 * 원천 상태(raw/loading/error, reload)는 useStepsStore로 분리합니다.
 */
export function useFetchSteps(goalId?: number | null): {
  raw: RespTodoSteps | null;
  view: GoalStepsView;
  todayView: GoalStepsView;
  lists: TodayPastLists;
  loading: boolean;
  error: unknown;
  reload: (gid?: number | null) => Promise<void>;
} {
  const { raw, loading, error, setRaw, setLoading, setError, setReloader } = useStepsStore();

  // 언마운트 뒤 setState 방지용 플래그
  const alive = useRef(true);
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  // fetch + 스토어 업데이트
  const reload = useCallback(
    async (gid: number | null | undefined = goalId) => {
      if (gid == null) return;
      try {
        setLoading(true);
        setError(null);
        const data = (await fetchSteps(gid)) as RespTodoSteps;
        if (alive.current) setRaw(data);
      } catch (e) {
        if (alive.current) setError(e);
      } finally {
        if (alive.current) setLoading(false);
      }
    },
    [goalId, setError, setLoading, setRaw],
  );

  // 외부에서 스토어를 통해 재사용 가능하도록 리로더 주입
  useEffect(() => {
    setReloader(reload);
  }, [reload, setReloader]);

  // goalId 바뀔 때 자동 로드
  useEffect(() => {
    void reload(goalId);
  }, [goalId, reload]);

  // 파생 뷰들 메모이즈
  const view = useMemo<GoalStepsView>(() => toGoalStepsView(raw), [raw]);
  const todayView = useMemo<GoalStepsView>(() => toTodayStepsView(raw), [raw]);
  const lists = useMemo<TodayPastLists>(() => toTodayAndPastLists(raw), [raw]);

  return { raw, view, todayView, lists, loading, error, reload };
}

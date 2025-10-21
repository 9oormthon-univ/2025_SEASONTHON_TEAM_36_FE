// src/pages/home/hooks/useFetchSteps.ts
import { useCallback, useEffect, useRef } from "react";

import { fetchSteps } from "@/apis/step";
import type { RespTodoSteps } from "@/common/types/response/step";
import { useStepsStore } from "@/pages/home/store/useStepsStore";

export function useFetchSteps(goalId?: number | null) {
  const { ingestApiResult, setReloader } = useStepsStore();
  const alive = useRef(true);

  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const reload = useCallback(
    async (gid: number | null | undefined = goalId) => {
      if (gid == null) return;
      try {
        // 로딩 시작
        ingestApiResult({ goalId: gid, raw: null, loading: true, error: null });

        const data = (await fetchSteps(gid)) as RespTodoSteps;
        if (alive.current) {
          ingestApiResult({ goalId: gid, raw: data, loading: false, error: null });
        }
      } catch (err) {
        // ❗ 실패 시에도 ingestApiResult 호출 (→ fallback 발동)
        if (alive.current) {
          ingestApiResult({ goalId: gid, raw: null, loading: false, error: err });
        }
      }
    },
    [goalId, ingestApiResult],
  );

  useEffect(() => {
    setReloader(reload);
  }, [reload, setReloader]);

  // goalId 변경 시 자동 실행
  useEffect(() => {
    void reload(goalId);
  }, [goalId, reload]);
}

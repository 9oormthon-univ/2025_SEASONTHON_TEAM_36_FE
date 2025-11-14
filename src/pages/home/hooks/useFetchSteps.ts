// src/pages/home/hooks/useFetchSteps.ts
import { useEffect, useRef, useState } from "react";

import { fetchSteps } from "@/apis/step";
import type { RespTodoSteps } from "@/common/types/response/step";

/**
 * goalId에 대한 스텝 데이터를 불러오는 훅
 * - enabled === true && goalId가 있을 때만 서버 호출
 * - StepsStore에 직접 쓰지 않고, data/loading/error만 반환
 */
export function useFetchSteps(goalId: number | null, enabled: boolean) {
  const [data, setData] = useState<RespTodoSteps | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const alive = useRef(true);

  // 마운트/언마운트 생존 플래그
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  useEffect(() => {
    // 모달이 닫혀 있거나 goalId가 없으면 아무 것도 안 함
    if (!enabled || goalId == null) return;

    let cancelled = false;

    void (async () => {
      try {
        setLoading(true);
        setError(null);

        const res = (await fetchSteps(goalId)) as RespTodoSteps;

        if (!alive.current || cancelled) return;

        setData(res);
      } catch (err) {
        if (!alive.current || cancelled) return;

        setError(err);
        setData(null);
      } finally {
        if (!alive.current || cancelled) {
          // return 대신 그냥 바로 끝내기
        } else {
          setLoading(false);
        }
      }
    })();

    // goalId/enabled 변경 또는 언마운트 시 현재 요청만 취소 플래그
    return () => {
      cancelled = true;
    };
  }, [goalId, enabled]);

  return { data, loading, error };
}

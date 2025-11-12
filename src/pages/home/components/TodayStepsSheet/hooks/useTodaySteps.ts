import { useCallback, useEffect, useState } from "react";

import { fetchTodaySteps } from "@/apis/step";
import type { RespStepItem, RespTodayStep } from "@/common/types/response/step";
import type { StepListGroup, StepListItem } from "@/pages/home/types/steps";

/** RespStepItem -> StepListItem 변환기 (중간 ViewModel 없이 바로 매핑) */
function mapRespToListItem(_prefix: "today" | "past") {
  return (s: RespStepItem, idx: number): StepListItem => {
    return {
      // StepViewItem 필수
      stepId: s.stepId ?? null, // (서버는 number지만 nullable 타입 호환)
      stepOrder: idx + 1, // 서버에 순서 없음 → idx+1
      stepDate: s.stepDate ?? "", // 없으면 빈 문자열
      description: s.description ?? "",
      isCompleted: !!s.isCompleted,
      isPaused: !!s.isPaused,
      tips: s.tips ?? "",
      // StepListItem 확장
      state: s.isPaused ? "pause" : s.isCompleted ? "done" : "idle",
      id: s.stepId, // playingKey 비교용 id
    };
  };
}

/** 날짜 최신순 정렬 (stepDate desc → 같은 날짜면 stepOrder asc) */
function sortDescByDate(items: StepListItem[]): StepListItem[] {
  return [...items].sort((a, b) => {
    const ad = a.stepDate || "";
    const bd = b.stepDate || "";
    if (ad === bd) return a.stepOrder - b.stepOrder;
    return bd.localeCompare(ad); // ISO yyyy-mm-dd 기준 문자열 비교로 desc
  });
}

/**
 * /api/v1/steps/one-step/{todoId}
 * 오늘/놓친 한 걸음 리스트를 "그룹 형태"로 반환하는 훅
 */
export function useTodaySteps(todoId?: number | null) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [groups, setGroups] = useState<StepListGroup[]>([
    { key: "today", title: "오늘의 한 걸음", items: [] },
    { key: "past", title: "놓친 한 걸음", items: [] },
  ]);

  const refetch = useCallback(async () => {
    if (todoId == null) {
      setGroups([
        { key: "today", title: "오늘의 한 걸음", items: [] },
        { key: "past", title: "놓친 한 걸음", items: [] },
      ]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const result = (await fetchTodaySteps(todoId)) as RespTodayStep;

      // today
      const todayItems = sortDescByDate(
        (result.todayStepResponses ?? []).map(mapRespToListItem("today")),
      );

      // past: missed + completedMissed 모두 포함
      const pastRaw = [
        ...(result.missedStepResponses ?? []),
        ...(result.completedMissedStepResponses ?? []),
      ];

      // ☁️ 안전: stepId 기준으로 중복 제거
      const pastDedup = Array.from(
        new Map<number, RespStepItem>(pastRaw.map(s => [s.stepId, s])).values(),
      );

      const pastItems = sortDescByDate(pastDedup.map(mapRespToListItem("past")));

      setGroups([
        { key: "today", title: "오늘의 한 걸음", items: todayItems },
        { key: "past", title: "놓친 한 걸음", items: pastItems },
      ]);
    } catch (e) {
      setError(e);
    } finally {
      setLoading(false);
    }
  }, [todoId]);

  useEffect(() => {
    void refetch();
  }, [refetch]);

  return { loading, error, groups, refetch };
}

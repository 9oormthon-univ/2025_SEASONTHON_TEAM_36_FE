// src/pages/home/components/TodayStepsSheet/hooks/useSheetStepsView.ts
import { useEffect, useMemo } from "react";

// ⬇️ 스토어 직접 사용
import { useStepsStore } from "@/pages/home/store/useStepsStore";
import { StepListGroup, TodayPastLists } from "@/pages/home/types/steps";
import { toTodayAndPastLists } from "@/pages/home/utils/stepsView";

import { toPaused } from "../utils/stepMappers";

export function useSheetStepsView(goalId?: number | null) {
  // 스토어 상태 구독
  const raw = useStepsStore(s => s.raw);
  const loading = useStepsStore(s => s.loading);
  const error = useStepsStore(s => s.error);
  const reloadSteps = useStepsStore(s => s.reloadSteps); // useFetchSteps에서 주입된 리로더(없으면 no-op)

  // goalId 바뀔 때 자동 로드 (리로더가 주입되어 있다면)
  useEffect(() => {
    if (goalId == null) return;
    void reloadSteps(goalId);
  }, [goalId, reloadSteps]);

  // 기존 에러 알림 동작 유지
  useEffect(() => {
    if (!error) return;
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    alert(msg || "할 일(step) 목록을 불러오지 못했습니다.");
  }, [error]);

  // 원천(raw) → today/past 분할
  const lists = useMemo<TodayPastLists>(() => toTodayAndPastLists(raw), [raw]);

  // parted(원형 데이터) 그대로 노출 (기본값 가드)
  const parted: TodayPastLists = lists ?? {
    meta: { dDay: "", title: "", endDate: "", progressText: "", progress: 0 },
    today: [],
    past: [],
  };

  // 화면용 아이템 가공
  const todayItems = useMemo(() => parted.today.map(toPaused("today")), [parted.today]);
  const pastItems = useMemo(() => parted.past.map(toPaused("past")), [parted.past]);

  // 공용 타입 그룹
  const baseGroups: StepListGroup[] = useMemo(
    () => [
      { key: "today", title: "오늘의 한 걸음", items: todayItems },
      { key: "past", title: "놓친 한 걸음", items: pastItems },
    ],
    [todayItems, pastItems],
  );

  return { loading, parted, baseGroups };
}

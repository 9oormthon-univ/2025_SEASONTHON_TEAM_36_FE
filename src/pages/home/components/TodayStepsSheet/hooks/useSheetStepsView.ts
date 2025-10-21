// src/pages/home/components/TodayStepsSheet/hooks/useSheetStepsView.ts
import { useEffect, useMemo } from "react";

import { useFetchSteps } from "@/pages/home/hooks/useFetchSteps"; // ✅ 새 훅 사용
import { StepListGroup, TodayPastLists } from "@/pages/home/types/steps";

import { toPaused } from "../utils/stepMappers";

export function useSheetStepsView(goalId?: number | null) {
  // 훅에서 today/past 리스트, 로딩/에러 상태를 모두 제공
  const { lists, loading, error } = useFetchSteps(goalId);

  // 기존 에러 알림 동작 유지
  useEffect(() => {
    if (!error) return;
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    alert(msg || "할 일(step) 목록을 불러오지 못했습니다.");
  }, [error]);

  // parted(원형 데이터) 그대로 노출 (기본값 가드)
  const parted: TodayPastLists = lists ?? {
    meta: { dDay: "", title: "", endDate: "", progressText: "", progress: 0 },
    today: [],
    past: [],
  };

  // 표시 아이템 가공
  const todayItems = useMemo(() => parted.today.map(toPaused("today")), [parted.today]);
  const pastItems = useMemo(() => parted.past.map(toPaused("past")), [parted.past]);

  // 공용 타입에 맞춘 그룹
  const baseGroups: StepListGroup[] = useMemo(
    () => [
      { key: "today", title: "오늘의 한 걸음", items: todayItems },
      { key: "past", title: "놓친 한 걸음", items: pastItems },
    ],
    [todayItems, pastItems],
  );

  return { loading, parted, baseGroups };
}

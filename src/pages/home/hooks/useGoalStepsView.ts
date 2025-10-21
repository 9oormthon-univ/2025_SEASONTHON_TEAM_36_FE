// src/pages/home/utils/useGoalStepsView.ts
import { useEffect, useMemo } from "react";

import { useStepsStore } from "@/pages/home/store/useStepsStore";
import type { GoalStepsView } from "@/pages/home/types/steps";

import { toGoalStepsView } from "../utils/stepsView";

const EMPTY_VM: GoalStepsView = {
  dDay: "D-0",
  title: "",
  endDate: "-",
  progressText: "",
  progress: 0,
  steps: [],
};

export function useGoalStepsView(open: boolean, goalId: number | string | null) {
  // goalId → number로 정규화
  const numId =
    typeof goalId === "string"
      ? Number.isFinite(Number(goalId))
        ? Number(goalId)
        : undefined
      : (goalId ?? undefined);

  // open이 false면 fetch 방지
  const effectiveId = open ? numId : undefined;

  // 스토어 상태 구독
  const raw = useStepsStore(s => s.raw);
  const loading = useStepsStore(s => s.loading);
  const error = useStepsStore(s => s.error);
  const reloadSteps = useStepsStore(s => s.reloadSteps);

  // goalId 바뀔 때 자동 로드 (리로더가 주입되어 있다면)
  useEffect(() => {
    if (effectiveId == null) return;
    void reloadSteps(effectiveId);
  }, [effectiveId, reloadSteps]);

  // 원천(raw) → GoalStepsView
  const view: GoalStepsView = useMemo(() => toGoalStepsView(raw), [raw]);

  // 기본값 가드
  const vm: GoalStepsView = useMemo(() => view ?? EMPTY_VM, [view]);

  // 외부에서 명시적으로 호출할 수 있게 래핑 (gid 없으면 effectiveId 사용)
  const reload = (gid?: number | null) => reloadSteps(gid ?? effectiveId ?? null);

  return { vm, view, loading, error, reload };
}

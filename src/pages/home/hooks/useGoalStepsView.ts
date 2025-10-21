// src/pages/home/utils/useGoalStepsView.ts
import { useMemo } from "react";

import { useFetchSteps } from "@/pages/home/hooks/useFetchSteps";
import type { GoalStepsView } from "@/pages/home/types/steps";

const EMPTY_VM: GoalStepsView = {
  dDay: "D-0",
  title: "",
  endDate: "-",
  progressText: "",
  progress: 0,
  steps: [],
};

export function useGoalStepsView(open: boolean, goalId: number | string | null) {
  const numId =
    typeof goalId === "string"
      ? Number.isFinite(Number(goalId))
        ? Number(goalId)
        : undefined
      : (goalId ?? undefined);

  // open이 false면 fetch 방지
  const effectiveId = open ? numId : undefined;

  const { view, loading, error, reload } = useFetchSteps(effectiveId);

  // view는 이미 GoalStepsView이므로 그대로 기본값 가드만
  const vm: GoalStepsView = useMemo(() => view ?? EMPTY_VM, [view]);

  return { vm, view, loading, error, reload };
}

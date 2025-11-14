// src/pages/home/utils/useGoalStepsView.ts
import { useMemo } from "react";

import type { GoalStepsView } from "@/pages/home/types/steps";

import { useFetchSteps } from "../hooks/useFetchSteps";
import { toGoalStepsView } from "../utils/toGoalStepsView";

const EMPTY_VM: GoalStepsView = {
  dDay: "D-0",
  title: "",
  endDate: "-",
  progressText: "",
  progress: 0,
  steps: [],
};

export function useGoalStepsView(open: boolean, goalId: number | string | null) {
  // goalId → number로 정규화 (유효하지 않으면 null)
  const numId: number | null =
    typeof goalId === "string"
      ? Number.isFinite(Number(goalId))
        ? Number(goalId)
        : null
      : (goalId ?? null);

  // 모달이 열려 있을 때만 fetch 수행 (useFetchSteps 내부에서도 한 번 더 체크함)
  const { data, loading, error } = useFetchSteps(numId, open);

  // 원천(data: RespTodoSteps | null) → GoalStepsView
  const view: GoalStepsView = useMemo(() => toGoalStepsView(data), [data]);

  // 기본값 가드
  const vm: GoalStepsView = useMemo(() => view ?? EMPTY_VM, [view]);

  // 예전엔 reloadSteps를 store에서 받아서 래핑했는데,
  // 이제는 store 의존을 제거했으므로 reload는 제공하지 않음.
  return { vm, view, loading, error };
}

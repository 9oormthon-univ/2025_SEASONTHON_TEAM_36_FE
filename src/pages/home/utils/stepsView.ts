// src/pages/home/utils/stepView.ts

import { RespTodoSteps } from "@/common/types/response/step";

import type { GoalStepsView, StepRaw } from "../types/steps";

/** 서버 원본 → 공통 뷰 모델로 변환 */
export function toGoalStepsView(raw: Partial<RespTodoSteps> | null | undefined): GoalStepsView {
  const s = raw ?? {};

  const progressNumSrc = typeof s.progress === "number" ? s.progress : Number(s.progress);
  const progressNum = Number.isFinite(progressNumSrc) ? progressNumSrc : 0;

  const stepsArr = Array.isArray(s.steps) ? (s.steps as StepRaw[]) : [];
  const steps = stepsArr
    .filter(Boolean)
    .map((x, idx) => {
      const stepOrderSrc = typeof x.stepOrder === "number" ? x.stepOrder : Number(x.stepOrder);
      const countSrc = typeof x.count === "number" ? x.count : Number(x.count);

      return {
        stepId: typeof x.stepId === "number" ? x.stepId : null,
        stepOrder: Number.isFinite(stepOrderSrc) ? stepOrderSrc : idx + 1,
        stepDate: typeof x.stepDate === "string" ? x.stepDate : "",
        description: typeof x.description === "string" ? x.description : "",
        count: Number.isFinite(countSrc) ? countSrc : 0,
        isCompleted: !!x.isCompleted,
      };
    })
    .sort((a, b) => {
      // 날짜 최신순 정렬 (stepDate 내림차순)
      const dateA = new Date(a.stepDate).getTime();
      const dateB = new Date(b.stepDate).getTime();
      if (!Number.isNaN(dateA) && !Number.isNaN(dateB) && dateA !== dateB) {
        return dateB - dateA; // 최신 날짜 먼저
      }
      // 날짜가 같거나 없으면 stepOrder 오름차순
      return a.stepOrder - b.stepOrder;
    });

  return {
    dDay: typeof s.dDay === "string" ? s.dDay : "D-0",
    title: typeof s.title === "string" ? s.title : "",
    endDate: typeof s.endDate === "string" ? s.endDate : "-",
    progressText: typeof s.progressText === "string" ? s.progressText : "",
    progress: progressNum,
    steps,
  };
}

// src/pages/home/utils/stepView.ts

import { RespTodoSteps } from "@/common/types/response/step";

import type { GoalStepsView, StepRaw, TodayPastLists } from "../types/steps";
import { isFutureISO, isTodayISO } from "./dates";

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

// 오늘의 한 걸음 / 놓친 한 걸음 관련 유틸은 새로 정의된 api 호출로 대체 예정
/** 완료 제외 + (오늘만) */
export function toTodayStepsView(raw: Partial<RespTodoSteps> | null | undefined): GoalStepsView {
  const view = toGoalStepsView(raw);
  return {
    ...view,
    steps: view.steps.filter(it => !it.isCompleted && isTodayISO(it.stepDate)),
  };
}

/** 완료 제외 후 '오늘'과 '과거' 리스트 분리 */
export function toTodayAndPastLists(
  raw: Partial<RespTodoSteps> | null | undefined,
): TodayPastLists {
  const view = toGoalStepsView(raw);
  const base = view.steps.filter(it => !it.isCompleted);

  const today = base.filter(it => isTodayISO(it.stepDate));
  // 과거: 오늘도 아니고, 미래도 아닌 것
  const past = base.filter(it => !isTodayISO(it.stepDate) && !isFutureISO(it.stepDate));

  return {
    // meta: {
    //   dDay: view.dDay,
    //   title: view.title,
    //   endDate: view.endDate,
    //   progressText: view.progressText,
    //   progress: view.progress,
    // },
    today,
    past,
  };
}

/* ⛔️ API 부르는 함수는 훅으로 이동했습니다.
  - getStepsRaw / getGoalStepsView / getTodayStepsView / getTodayAndPastLists 제거
  - 컴포넌트/훅에서는 useFetchSteps(goalId) 사용 */

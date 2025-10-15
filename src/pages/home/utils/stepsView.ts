// src/pages/home/utils/stepView.ts
import { fetchSteps } from "@/apis/step";

import { GoalId } from "../types/home";
import type { GoalStepsView, RespTodoSteps, StepRaw, TodayPastLists } from "../types/steps";
import { isFutureISO, isTodayISO } from "./dates";

/** 서버에서 goal의 steps 원본을 그대로 받아온다. */
export async function getStepsRaw(goalId: GoalId): Promise<RespTodoSteps> {
  if (goalId == null) throw new Error("goalId가 없어 step을 불러올 수 없음.");
  const data = (await fetchSteps(goalId)) as RespTodoSteps;
  return data; // { dDay, title, endDate, progressText, progress, steps: [...] }
}

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
    meta: {
      dDay: view.dDay,
      title: view.title,
      endDate: view.endDate,
      progressText: view.progressText,
      progress: view.progress,
    },
    today,
    past,
  };
}

/** 원본 + 전체 뷰 */
export async function getGoalStepsView(goalId: GoalId): Promise<GoalStepsView> {
  const raw = await getStepsRaw(goalId);
  return toGoalStepsView(raw);
}

/** 편의: Today 전용 뷰 */
export async function getTodayStepsView(goalId: GoalId): Promise<GoalStepsView> {
  const raw = await getStepsRaw(goalId);
  return toTodayStepsView(raw);
}

/** 편의: 오늘/과거 리스트를 한 번에 가져오기 */
export async function getTodayAndPastLists(goalId: GoalId): Promise<TodayPastLists> {
  const raw = await getStepsRaw(goalId);
  return toTodayAndPastLists(raw);
}

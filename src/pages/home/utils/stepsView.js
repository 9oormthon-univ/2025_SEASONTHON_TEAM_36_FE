// src/pages/home/utils/viewSteps.js
import { fetchSteps } from "@/apis/step";
import { isFutureISO, isTodayISO } from "./dates";

/** 서버에서 goal의 steps 원본을 그대로 받아온다. */
export async function getStepsRaw(goalId) {
  if (goalId == null) throw new Error("goalId가 필요합니다.");
  const data = await fetchSteps(goalId);
  return data; // { dDay, title, endDate, progressText, progress, steps: [...] }
}

/** 서버 원본 → 공통 뷰 모델로 변환 */
export function toGoalStepsView(raw) {
  const s = raw ?? {};
  const progressNum = Number.isFinite(+s.progress) ? +s.progress : 0;

  const stepsArr = Array.isArray(s.steps) ? s.steps : [];
  const steps = stepsArr
    .filter(Boolean)
    .map((x, idx) => ({
      stepId: x.stepId ?? null,
      stepOrder: Number.isFinite(+x.stepOrder) ? +x.stepOrder : idx + 1,
      stepDate: typeof x.stepDate === "string" ? x.stepDate : "",
      description: x.description ?? "",
      count: Number.isFinite(+x.count) ? +x.count : 0,
      isCompleted: !!x.isCompleted,
    }))
    .sort((a, b) => a.stepOrder - b.stepOrder);

  return {
    dday: s.dDay ?? "D-0",
    title: s.title ?? "",
    endDate: s.endDate ?? "-",
    progressText: s.progressText ?? "",
    progress: progressNum,
    steps,
  };
}

/** 완료 제외 + (오늘만) */
export function toTodayStepsView(raw) {
  const view = toGoalStepsView(raw);
  return {
    ...view,
    steps: view.steps.filter(
      (it) => !it.isCompleted && isTodayISO(it.stepDate)
    ),
  };
}

/** ✅ 완료 제외 후 '오늘'과 '과거' 리스트 분리 */
export function toTodayAndPastLists(raw) {
  const view = toGoalStepsView(raw);
  const base = view.steps.filter((it) => !it.isCompleted);

  const today = base.filter((it) => isTodayISO(it.stepDate));
  // 과거: 오늘도 아니고, 미래도 아닌 것
  const past = base.filter(
    (it) => !isTodayISO(it.stepDate) && !isFutureISO(it.stepDate)
  );

  return {
    meta: {
      dday: view.dday,
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
export async function getGoalStepsView(goalId) {
  const raw = await getStepsRaw(goalId);
  return toGoalStepsView(raw);
}

/** 편의: Today 전용 뷰 */
export async function getTodayStepsView(goalId) {
  const raw = await getStepsRaw(goalId);
  return toTodayStepsView(raw);
}

/** 편의: 오늘/과거 리스트를 한 번에 가져오기 */
export async function getTodayAndPastLists(goalId) {
  const raw = await getStepsRaw(goalId);
  return toTodayAndPastLists(raw);
}

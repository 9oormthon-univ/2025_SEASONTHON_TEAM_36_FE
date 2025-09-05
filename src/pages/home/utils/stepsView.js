// src/pages/home/utils/viewSteps.js
import { fetchSteps } from "@/apis/step";

/** 서버에서 goal의 steps 원본을 그대로 받아온다. */
export async function getStepsRaw(goalId) {
  if (goalId == null) throw new Error("goalId가 필요합니다.");
  const data = await fetchSteps(goalId);
  return data; // { dDay, title, endDate, progressText, progress, steps: [...] }
}

/** 서버 원본 → 모달이 쓰는 뷰 모델로 변환 */
export function toGoalStepsView(raw) {
  const s = raw ?? {};
  const progressNum = Number.isFinite(+s.progress) ? +s.progress : 0;

  const stepsArr = Array.isArray(s.steps) ? s.steps : [];
  const steps = stepsArr
    .filter(Boolean)
    .map((x, idx) => ({
      // 원본 필드명 + 안전한 기본값
      stepId: x.stepId ?? null,
      stepOrder: Number.isFinite(+x.stepOrder) ? +x.stepOrder : idx + 1,
      stepDate: typeof x.stepDate === "string" ? x.stepDate : "",
      description: x.description ?? "",
      count: Number.isFinite(+x.count) ? +x.count : 0,
      isCompleted: !!x.isCompleted,
    }))
    // 보이는 순서를 stepOrder 기준으로 안정화
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

// 원본 + 뷰 모델 
export async function getGoalStepsView(goalId) {
  const raw = await getStepsRaw(goalId);
  return toGoalStepsView(raw);
}

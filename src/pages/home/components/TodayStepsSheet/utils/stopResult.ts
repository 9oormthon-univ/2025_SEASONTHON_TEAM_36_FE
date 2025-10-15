// src/pages/home/components/utils/stopResult.ts

/** stopStep API 응답 타입 */
export interface StopStepResponse {
  isCompletedTodaySteps?: boolean | string | number;
  progress?: number | string | null;
  [key: string]: unknown; // 혹시 모를 여분 필드 대비
}

/** stopStep 응답으로 스플래시/진행률 판정 */
export function parseStopResult(res: StopStepResponse) {
  // 문자열 "true"/"1" 등까지 안전 처리
  const rawDone = res?.isCompletedTodaySteps;
  const doneToday = rawDone === true || rawDone === "true" || rawDone === 1 || rawDone === "1";

  const progressNum = Number(res?.progress);
  const hasProgress = Number.isFinite(progressNum);

  return {
    doneToday,
    progress: hasProgress ? progressNum : null,
    reachedGoal100: !doneToday && hasProgress && progressNum >= 100,
  };
}

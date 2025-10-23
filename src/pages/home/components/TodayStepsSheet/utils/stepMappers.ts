// src/pages/home/components/utils/stepMappers.ts
import type { StepListItem, StepViewItem } from "../../../types/steps";

/**
 * StepViewItem(정규화된 뷰 모델) -> StepListItem(리스트 아이템)
 * - 기본 state="pause"
 * - playingKey 비교용 id: stepId 있으면 우선 사용, 없으면 stepOrder, 둘 다 없으면 index
 */
export const toPaused =
  (prefix: string) =>
  <T extends StepViewItem>(s: T, i: number): StepListItem => {
    const fallbackId = s.stepId ?? s.stepOrder ?? i;
    return {
      ...s, // stepId, stepOrder, stepDate, description, count, isCompleted
      id: `${prefix}-${fallbackId}`, // playingKey 비교용 id (string | number 허용)
      state: "pause",
    };
  };

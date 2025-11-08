import { RespStepItem } from "@/common/types/response/step";

/** UI에서 사용하는 Step 상태 */
export type StepState = "play" | "pause" | "done";

/** applyPlayingState에서 비교하는 키(id)는 문자열/숫자 모두 가능하게 */
export type PlayingKey = string | number | null;

/** 서버 원본의 step 한 건(부족한 필드 보강: stepOrder, count는 없을 수 있어 Partial로) */
export type StepRaw = RespStepItem & {
  stepOrder?: number;
  count?: number;
};

/** 정규화된 단일 Step(뷰 모델) */
export interface StepViewItem {
  stepId: number | null;
  stepOrder: number; // 정렬용(없는 경우 idx+1)
  stepDate: string; // ISO(없으면 "")
  description: string;
  // count: number; // 기본 0
  isCompleted: boolean;
}

/** Goal 단위의 전체 Steps 뷰 모델 (toGoalStepsView 반환) */
export interface GoalStepsView {
  dDay: string; // "D-0" 등
  title: string;
  endDate: string;
  progressText: string;
  progress: number; // 0~100 가정(정규화는 호출부에서)
  steps: StepViewItem[]; // 날짜 최신순 정렬
}

/** applyPlayingState에 들어가는 그룹 구조(섹션 2개: prep / carried 등 가정) */
export interface StepListItem extends StepViewItem {
  /** 재생 상태(playingKey에 의해 play/pause로 바뀜) */
  state: StepState;
  /** playingKey 비교용 id(없다면 stepId를 그대로 맵핑해서 사용) */
  id: string | number;
}

export interface StepListGroup {
  key: string; // "prep" | "carried" 등 섹션 키
  title?: string;
  items: StepListItem[];
}

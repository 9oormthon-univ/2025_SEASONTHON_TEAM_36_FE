import type { Goal, Goals, StepType } from "../types/ToDo";

// 상태 타입 정의
interface CalendarStore {
  // 상태 속성
  curDate: Date;
  allToDo: Goals; // 날짜별 ToDo 목록 (Record<DateString, Goal>)
  curToDo: Goal; // 현재 선택된 날짜의 ToDo 목록
}

// 액션 타입 정의
interface CalendarActions {
  // 액션 메서드
  handleModifyStep: (goalId: number, stepId: number, description: string) => void;
  handleDeleteStep: (goalId: number, stepId: number) => void;
  handleToDo: (selectedDate: string | Date) => void;
  handleMoveMonth: (offset: number) => void;
}

// 전체 스토어 타입은 상태와 액션을 결합
export type CalendarState = CalendarStore & CalendarActions;

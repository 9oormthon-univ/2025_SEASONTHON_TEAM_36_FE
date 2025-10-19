/**
 * End-Point: /api/v1/steps/{stepId}
 * Step 수정
 * src/apis/step.ts의 modifyStep
 *
 * End-Point: /api/v1/steps/todo/{stepId}
 * 특정 Todo의 Step 전체 수정
 * src/apis/step.ts의 modifySteps
 */

export interface RespStepInfo {
  todoId: number;
  todoTitle: string;
  stepId: number;
  stepDate: string;
  description: string;
  isCompleted: boolean;
}

/**
 * End-Point: /api/v1/steps/todos/{todoId}
 * ToDo의 Step 목록 조회
 * src/apis/step.ts의 fetchSteps
 *
 * End-Point: /api/v1/ai/{todoId}/generate
 * AI ToDo 분해
 * src/apis/ai.ts의 destructToDoByAI
 */

export interface RespTodoSteps {
  dDay: string;
  title: string;
  endDate: string;
  progressText: string;
  progress: number;
  steps: Array<RespStepInfo>;
}

/**
 * End-Point: /api/v1/steps/{stepId}/start
 * Step 기록 시작
 * src/apis/step.ts의 startStep
 *
 * End-Point: /api/v1/steps/{stepId}/stop
 * Step 기록 종료
 * src/apis/ai.ts의 stopStep
 */
export interface RespStepRecord {
  stepId: number;
  userId: number;
  startTime: string;
  endTime: string;
  duration: number;
  progress: number;
  isCompletedTodaySteps: boolean;
}

/**
 * End-Point: /api/v1/calendars
 * 캘린더 조회
 * src/apis/calendar.ts의 calendarApi
 */

interface StepCalendar {
  stepCalendarId: number;
  calendarDate: string;
  percentage: number;
  stepResponses: Array<RespStepInfo>;
}

export interface RespCalendar {
  calendar: Array<StepCalendar>;
  todayToDo: Array<RespStepInfo>;
}

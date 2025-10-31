/** [GET] /api/v1/diaries: 특정 달의 Diary 조회 (쿼리 파라미터: yearMonth -> "yyyy-MM" 형식) */
export interface RespDiary {
  date: string;
  mood: string;
}

/** [GET] /api/v1/diaries/detail: 특정 달의 Diary 상세 조회 (쿼리 파라미터: date -> "yyyy-MM-dd" 형식) */
export interface RespDiaryDetail {
  date: string;
  todayCompletedTodoResponses: TodayCompletedTodo[];
  emotion: number;
  energy: number;
  place: string;
  mood: string;
  focusLevel: number;
  completionLevel: string;
  memo: string;
  photoUrl: string;
}

interface TodayCompletedTodo {
  todoId: number;
  todoTitle: string;
  processTime: ProcessTime;
  ratio: number;
}

interface ProcessTime {
  seconds: number;
  nano: number;
  negative: boolean;
  zero: boolean;
  units: Unit[];
}

interface Unit {
  dateBased: boolean;
  timeBased: boolean;
  durationEstimated: boolean;
}

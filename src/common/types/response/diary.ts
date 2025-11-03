/** [GET] /api/v1/diaries: 특정 달의 Diary 조회 (쿼리 파라미터: yearMonth -> "yyyy-MM" 형식) */
export interface RespDiary {
  date: string;
  mood: string;
}

// RespDiaryDetail 필드 안 enum 값들
type Place = "HOME" | "WORK" | "CAFE" | "LIBRARY" | "CLASSROOM" | "OTHER";

type Mood =
  | "HAPPY"
  | "EXCITED"
  | "CALM"
  | "NORMAL"
  | "THRILLING"
  | "FRUSTRATED"
  | "DEPRESSED"
  | "EMPTY"
  | "ANGRY"
  | "DISAPPOINTED";

type CompletionLevel = "ZERO" | "TWENTY_FIVE" | "FIFTY" | "SEVENTY_FIVE" | "ONE_HUNDRED";
/** [GET] /api/v1/diaries/detail: 특정 달의 Diary 상세 조회 (쿼리 파라미터: date -> "yyyy-MM-dd" 형식) */
export interface RespDiaryDetail {
  /** "yyyy-MM-dd" */
  date: string;
  todayCompletedTodoResponses: TodayCompletedTodo[]; // 추후 수정 필요
  emotion: number;
  energy: number;
  place: Place; // enum
  mood: Mood; // enum
  focusLevel: number;
  completionLevel: CompletionLevel; // enum
  memo: string;
  photoUrl: string;
}

interface TodayCompletedTodo {
  // 추후 수정 필요
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

import { CompletionLevel, Mood } from "../enums";

/** BEFORE (시작 전) */
export interface ReqDailyLogBefore {
  emotion: number; // 1~5
  userId: number; // 로그인 유저 ID
  energy: number; // 1~5
  place: string; // "HOME" | "CAFE" | ... (백엔드 enum 문자열)
}

/** AFTER (종료 후) */
export interface ReqDailyLogAfter {
  mood: Mood;
  focusLevel: number; // 1~5
  completionLevel: CompletionLevel;
  memo?: string;
  /** 업로더를 통해 확보한 최종 접근 URL */
  photoUrl?: string;
}

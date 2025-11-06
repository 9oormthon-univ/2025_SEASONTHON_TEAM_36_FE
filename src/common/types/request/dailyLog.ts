import { CompletionLevel, Mood, Weather } from "../enums";

/** BEFORE (시작 전) */
export interface ReqDailyLogBefore {
  emotion: number; // 1~5
  energy: number; // 1~5
  weather: Weather;
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

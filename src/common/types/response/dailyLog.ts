/** BEFORE (시작 전) */
export interface RespDailyLogBefore {
  id: number;
  emotion: number;
  userId: number;
  energy: number;
  place: string; // "HOME" 등
  createdAt: string; // ISO date string
}

/** AFTER (종료 후) */
export interface RespDailyLogAfter {
  id: number;
  mood: string;
  focusLevel: number;
  completionLevel: string;
  memo?: string | null;
  photoUrl?: string | null;
  createdAt: string; // ISO date string
}

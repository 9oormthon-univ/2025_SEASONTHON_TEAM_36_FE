export interface RespMonthlyTodos {
  title: string;
  startDate: string;
  endDate: string;
  totalDuration: 0;
}

export interface RespFocusTime {
  weekOfMonth: number;
  minDuration: number | null;
  maxDuration: number | null;
  minDurationText: string | null;
  maxDurationText: string | null;
  startDate: string;
  endDate: string;
}

export interface RespAchievementRate {
  weekOfMonth: number;
  rate: number;
  startDate: string;
  endDate: string;
}

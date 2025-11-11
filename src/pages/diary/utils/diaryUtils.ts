// ================================
// src/pages/diary/utils/diaryUtils.ts
// 공통 유틸 & 매퍼 모음
// ================================

import type { CompletionLevel, Mood, Weather } from "@/common/types/enums";
import { TodayCompletedTodo } from "@/common/types/response/diary";

// ---------- Likert 1~5 → 0-based index (배열 길이로 클램프)
export function likert1to5ToIndex(v: number | null | undefined, arrLen: number): number {
  const n = typeof v === "number" ? v : 1; // 기본값 1
  const clamped = Math.min(5, Math.max(1, n)); // 1~5로 클램프
  return Math.min(arrLen - 1, Math.max(0, clamped - 1)); // 0-based
}

// ---------- CompletionLevel → percent & index 도우미
export const COMPLETION_TO_PERCENT: Record<CompletionLevel, number> = {
  ZERO: 0,
  TWENTY_FIVE: 25,
  FIFTY: 50,
  SEVENTY_FIVE: 75,
  ONE_HUNDRED: 100,
};

/**
 * UI의 PERFECTION 아이콘 배열(길이 5 가정) 기준 인덱스 계산
 * - 0, 25, 50, 75 → 0~3
 * - 100 → 4 (마지막 아이콘)
 */
export function completionPercentToIndex(percent: number): number {
  return Math.floor(percent === 100 ? 4 : percent / 20);
}

// ---------- 서버 enum → UI 인덱스 매핑들
export const WEATHER_TO_IDX: Record<Weather, number> = {
  SUNNY: 0,
  CLOUDY: 1,
  RAINY: 2,
  SNOWY: 3,
  WINDY: 4,
};

export const MOOD_TO_IDX: Record<Mood, number> = {
  HAPPY: 0,
  EXCITED: 1,
  CALM: 2,
  NORMAL: 3,
  THRILLING: 4,
  FRUSTRATED: 5,
  DEPRESSED: 6,
  EMPTY: 7,
  ANGRY: 8,
  DISAPPOINTED: 9,
};

// ---------- UI id(1~10) → 서버 Mood enum (작성 화면에서 사용)
export const ID_TO_MOOD: Record<number, Mood> = {
  1: "HAPPY",
  2: "EXCITED", // LOVE 이미지는 EXCITED로 매핑
  3: "CALM",
  4: "NORMAL",
  5: "THRILLING",
  6: "FRUSTRATED",
  7: "DEPRESSED",
  8: "EMPTY",
  9: "ANGRY",
  10: "DISAPPOINTED",
};

// 유틸: i번째 색상 고르기
export const pickColor = (palette: readonly string[], i: number) => palette[i % palette.length];

// 문자열 "PT4M7S" 같은 ISO 8601 duration → 초 단위 변환
export function parseISODurationToSeconds(input: string | null | undefined): number {
  if (!input || typeof input !== "string") return 0;
  const match = input.match(/P(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/);
  if (!match) return 0;
  const hours = parseFloat(match[1] || "0");
  const minutes = parseFloat(match[2] || "0");
  const seconds = parseFloat(match[3] || "0");
  return hours * 3600 + minutes * 60 + seconds;
}

// 차트 컴포넌트에 주입하기 위한 표준화 타입
export type GoalForChart = {
  id: number;
  name: string;
  timeSecs: number;
  ratio: number;
  color: string;
};

// 공통 팔레트(읽기 화면과 호환 위해 기본값 제공)
export const GOAL_COLORS = [
  "var(--green-500)",
  "var(--green-400)",
  "var(--green-300)",
  "var(--green-200)",
  "var(--green-100)",
] as const;

export function mapTodosToChartGoals(
  todos: TodayCompletedTodo[] | undefined | null,
  palette: readonly string[] = GOAL_COLORS,
): GoalForChart[] {
  const list = Array.isArray(todos) ? todos : [];
  return list.map((t, i) => ({
    id: t.todoId,
    name: t.todoTitle,
    timeSecs: parseISODurationToSeconds(t.processTime),
    ratio: typeof t.ratio === "number" ? t.ratio : 0,
    color: pickColor(palette, i),
  }));
}

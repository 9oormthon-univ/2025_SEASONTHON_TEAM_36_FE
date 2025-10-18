// src/apis/diaryLog.ts
import type { ErrorResponse } from "react-router-dom";

import { handleApiRequest } from "./apiUtils";
import mainApi from "./index";

/** Types — BEFORE (시작 전)*/
export interface ReqDailyLogBefore {
  emotion: number; // 예: 1~5
  userId: number; // 로그인 유저 ID
  energy: number; // 예: 1~5
  place: string; // 예: "HOME" | "CAFE" | ... (백엔드 enum 문자열)
}

export interface RespDailyLogBefore {
  id: number;
  emotion: number;
  userId: number;
  energy: number;
  place: string; // "HOME" 등
  createdAt: string; // ISO date string (예시: "2025-09-07")
}

/** Types — AFTER (종료 후) */
export type Mood = string;

/** 예: "ZERO" | "TWENTY" | "FIFTY" | "EIGHTY" | "COMPLETE" */
export type CompletionLevel = string;

export interface ReqDailyLogAfter {
  mood: Mood; // 예: "HAPPY"
  focusLevel: number; // 예: 1~5
  completionLevel: CompletionLevel; // 예: "FIFTY"
  memo?: string;
  /** 사진 URL — 업로더를 통해 확보된 최종 접근 URL. 클라이언트에서 처리 필요 */
  photoUrl?: string;
}

export interface RespDailyLogAfter {
  id: number;
  mood: Mood;
  focusLevel: number;
  completionLevel: CompletionLevel;
  memo?: string | null;
  photoUrl?: string | null;
  createdAt: string; // ISO date string
}

// ------- api 엔드포인트 -------

/** [POST] 오늘 DailyLogBefore 생성 */
export async function createDailyLogBefore(
  body: ReqDailyLogBefore,
): Promise<RespDailyLogBefore | ErrorResponse | string> {
  return handleApiRequest<RespDailyLogBefore>(() => mainApi.post("/api/v1/daily-log/before", body));
}

/** [POST] 오늘 DailyLogAfter 생성 (사진 URL 포함 가능) */
export async function createDailyLogAfter(
  body: ReqDailyLogAfter,
): Promise<RespDailyLogAfter | ErrorResponse | string> {
  return handleApiRequest<RespDailyLogAfter>(() => mainApi.post("/api/v1/daily-log/after", body));
}

/** [GET] 오늘 DailyLogBefore 조회 */
export async function getDailyLogBeforeToday() {
  return handleApiRequest<RespDailyLogBefore | null>(() =>
    mainApi.get("/api/v1/daily-log/before/today", {
      headers: { Accept: "application/json" },
    }),
  );
}

/** [GET] 오늘 DailyLogAfter 조회 */
export async function getDailyLogAfterToday() {
  return handleApiRequest<RespDailyLogAfter>(() =>
    mainApi.get("/api/v1/daily-log/after/today", {
      headers: { Accept: "application/json" },
    }),
  );
}

// 추후 통계 관련 GET api 구현

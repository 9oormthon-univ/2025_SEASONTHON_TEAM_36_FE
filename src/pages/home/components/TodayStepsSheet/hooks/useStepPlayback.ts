// src/pages/home/components/TodayStepsSheet/hooks/useStepPlayback.ts

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ErrorResponse } from "react-router-dom";

import { startStep, stopStep } from "@/apis/step";
import type { RespStepRecord } from "@/common/types/response/step";
import { PlayingKey } from "@/pages/home/types/steps";

import { parseStopResult, StopStepResponse } from "../utils/stopResult";

// ---------- helpers (파일 내부에만 사용) ----------
const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

/** RespStepRecord 타입 가드 */
function isRespStepRecord(v: unknown): v is RespStepRecord {
  if (typeof v !== "object" || v === null) return false;
  const obj = v as Record<string, unknown>;
  return typeof obj.stepId === "number" && typeof obj.progress === "number";
}

/** ErrorResponse 타입 가드 */
function isErrorResponse(v: unknown): v is ErrorResponse {
  if (typeof v !== "object" || v === null) return false;
  return "status" in v;
}

type Group = { items: Array<{ id: string | number; stepId: number | null }> };
export function useStepPlayback({
  goalId,
  groups,
  onStepCompl,
  onOpenDailyIfNeeded,
}: {
  goalId?: number | null;
  groups: Group[];
  onStepCompl?: () => void;
  onOpenDailyIfNeeded?: () => void;
}) {
  const [selectedStep, setSelectedStep] = useState<{
    id: number | string;
    stepId: number | null;
  } | null>(null);
  const [playingKey, setPlayingKey] = useState<PlayingKey>(null);
  const [startTimes, setStartTimes] = useState<Record<string, Date>>({});
  const [endTimes, setEndTimes] = useState<Record<string, Date>>({});
  const [lastProgress, setLastProgress] = useState<number | null>(null);

  // Splash states
  const [pauseOpen, setPauseOpen] = useState(false);
  const [goalCompleteOpen, setGoalCompleteOpen] = useState(false);
  const [dayCompleteOpen, setDayCompleteOpen] = useState(false);

  const busyRef = useRef(false);
  const allItems = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const closePause = () => setPauseOpen(false);
  const closeGoal = () => setGoalCompleteOpen(false);
  const closeDay = () => setDayCompleteOpen(false);

  const handleStopResult = useCallback((res: unknown) => {
    const { doneToday, progress, reachedGoal100 } = parseStopResult(res as StopStepResponse);
    if (progress != null) setLastProgress(progress);

    // 1) 오늘 스텝 모두 완료 → DayComplete만
    if (doneToday) {
      setPauseOpen(false);
      setPlayingKey(null);
      setDayCompleteOpen(true);
      return true;
    }
    // 2) 목표 100% → GoalComplete (단, doneToday가 아닐 때만)
    if (reachedGoal100) {
      setPauseOpen(false);
      setPlayingKey(null);
      setGoalCompleteOpen(true);
      return true;
    }
    // 3) 그 외 → Pause 유지
    return false;
  }, []);

  // goalId 전환 시 자동 정지
  const prevGoalRef = useRef(goalId);
  useEffect(() => {
    if (prevGoalRef.current !== goalId) {
      const prevKey = playingKey;
      if (prevKey) {
        const prevItem = allItems.find(it => it.id === prevKey);
        const prevStepId = prevItem?.stepId ?? null;

        void (async () => {
          try {
            if (prevStepId != null) {
              const res = await stopStep(prevStepId);
              handleStopResult(res);
            }
          } catch (e: unknown) {
            console.error("[useStepPlayback] stop on goal change failed:", e);
          }
        })();

        setEndTimes(prev => ({ ...prev, [prevKey]: new Date() }));
        setPlayingKey(null);
      }
      prevGoalRef.current = goalId;
    }
  }, [goalId, playingKey, allItems, handleStopResult]);

  const handleAction = async (it: { id: number | string; stepId: number | null }) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const isPlaying = playingKey === it.id;
      setSelectedStep(it);

      if (isPlaying) {
        // ===== 정지 =====
        setEndTimes(prev => ({ ...prev, [it.id]: new Date() }));
        setPauseOpen(true);
        setPlayingKey(null);

        if (it.stepId != null) {
          try {
            const res = await stopStep(it.stepId);
            const intercepted = handleStopResult(res);
            if (!intercepted) {
              // 특별 스플래시가 없으면 Pause 유지
            }
          } catch (e: unknown) {
            console.error("[useStepPlayback] stopStep error:", e);
            alert(errMsg(e) || "정지 로그 저장에 실패했습니다.");
          }
        }
      } else {
        // ===== 다른 항목 재생 중이면 먼저 정지 =====
        if (playingKey && playingKey !== it.id) {
          const prevItem = allItems.find(x => x.id === playingKey);
          const prevStepId = prevItem?.stepId ?? null;

          setEndTimes(prev => ({ ...prev, [playingKey]: new Date() }));
          if (prevStepId != null) {
            try {
              const resPrev = await stopStep(prevStepId);
              const interceptedPrev = handleStopResult(resPrev);
              if (interceptedPrev) {
                // 완료 스플래시면 새로운 재생 시작 안 함
                return;
              }
            } catch (e: unknown) {
              console.error("[useStepPlayback] stopStep(prev) error:", e);
            }
          }
        }

        // ===== 새 항목 재생 =====
        setPlayingKey(it.id);
        setPauseOpen(false);
        setStartTimes(prev => ({ ...prev, [it.id]: new Date() }));
        setEndTimes(prev => {
          const { [it.id]: _, ...rest } = prev;
          return rest;
        });

        if (it.stepId != null) {
          try {
            const res = await startStep(it.stepId);

            // ⬇️ 타입 가드로 안전하게 처리
            if (isRespStepRecord(res)) {
              setLastProgress(res.progress);
            } else if (isErrorResponse(res)) {
              alert(res.statusText ?? "시작 로그 저장에 실패했습니다.");
            } else if (typeof res === "string") {
              alert(res || "시작 로그 저장에 실패했습니다.");
            }

            onStepCompl?.();
          } catch (e: unknown) {
            console.error("[useStepPlayback] startStep error:", e);
            alert(errMsg(e) || "시작 로그 저장에 실패했습니다.");
          }
        }

        onOpenDailyIfNeeded?.();
      }
    } finally {
      busyRef.current = false;
    }
  };

  return {
    selectedStep,
    playingKey,
    startTimes,
    endTimes,
    lastProgress,
    pauseOpen,
    goalCompleteOpen,
    dayCompleteOpen,
    handleAction,
    closePause,
    closeGoal,
    closeDay,
  };
}

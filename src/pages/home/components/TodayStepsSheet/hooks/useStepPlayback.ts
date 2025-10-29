// src/pages/home/components/TodayStepsSheet/hooks/useStepPlayback.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { startStep, stopStep } from "@/apis/step";
import { RespStepRecord } from "@/common/types/response/step";
import { useGoalsStore } from "@/pages/home/store/useGoalsStore";
import { PlayingKey } from "@/pages/home/types/steps";

// ---------- helpers (파일 내부에서만 사용) ----------
const errMsg = (e: unknown): string => (e instanceof Error ? e.message : String(e));

type Group = { items: Array<{ id: string | number; stepId: number | null }> };

export function useStepPlayback({
  goalId,
  groups,
  onOpenDailyIfNeeded,
}: {
  goalId?: number | null;
  groups: Group[];
  onOpenDailyIfNeeded?: () => void;
}) {
  // store에서 직접 reloadTodos 사용
  const reloadTodos = useGoalsStore(s => s.reloadTodos);

  // 마지막으로 사용자가 조작한 아이템(재생/정지 대상)
  const [selectedStep, setSelectedStep] = useState<{
    id: number | string;
    stepId: number | null;
  } | null>(null);

  // 현재 재생중인 아이템의 id
  const [playingKey, setPlayingKey] = useState<PlayingKey>(null);

  // 재생 시작 / 종료 시간
  const [startTimes, setStartTimes] = useState<Record<string, Date>>({});
  const [endTimes, setEndTimes] = useState<Record<string, Date>>({});

  // 서버가 돌려 준 최신 진행률(%) 캐시
  const [lastProgress, setLastProgress] = useState<number | null>(null);

  // 스플래시 상태
  const [pauseOpen, setPauseOpen] = useState(false);
  const [goalCompleteOpen, setGoalCompleteOpen] = useState(false);
  const [dayCompleteOpen, setDayCompleteOpen] = useState(false);

  // 동시 입력 (더블 탭 등)으로 인한 중복 실행 방지 플래그
  const busyRef = useRef(false);

  // 보조 계산) playingKey에서 대응되는 stepId를 찾거나, 이전 재생 중 아이템을 끊을 때 사용
  const allItems = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const closePause = () => setPauseOpen(false);
  const closeGoal = () => setGoalCompleteOpen(false);
  const closeDay = () => setDayCompleteOpen(false);

  // RespStepRecord 기반으로 직접 판정 (외부 유틸 의존성 제거)
  const handleStopResult = useCallback(
    (res: RespStepRecord) => {
      const doneToday = Boolean(res.isCompletedTodaySteps);
      const p = Number(res.progress);
      const progress = Number.isFinite(p) ? p : null;
      const reachedGoal100 = !doneToday && progress != null && progress >= 100;

      if (progress != null) setLastProgress(progress);

      void reloadTodos();

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
    },
    [reloadTodos],
  );

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
              const endTime = new Date().toISOString();
              const duration = 0; // TODO: 계산 로직 연결
              const res = await stopStep(prevStepId, { endTime, duration });
              handleStopResult(res as RespStepRecord);
            }
          } catch (e: unknown) {
            console.error("[useStepPlayback] stop on goal change failed:", e);
          } finally {
            void reloadTodos();
          }
        })();

        setEndTimes(prev => ({ ...prev, [prevKey]: new Date() }));
        setPlayingKey(null);
      }
      prevGoalRef.current = goalId;
    }
  }, [goalId, playingKey, allItems, handleStopResult, reloadTodos]);

  // !!! 핵심 인터랙션 담당하는 함수
  const handleAction = async (it: { id: number | string; stepId: number | null }) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const isPlaying = playingKey === it.id;
      setSelectedStep(it);

      // 1) 현재 항목이 재생 중인 경우(토글→정지)
      if (isPlaying) {
        setEndTimes(prev => ({ ...prev, [it.id]: new Date() }));
        setPauseOpen(true);
        setPlayingKey(null);

        if (it.stepId != null) {
          try {
            const endTime = new Date().toISOString();
            const startTime = startTimes[it.id];
            const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0; // 초 단위 누적
            const res = (await stopStep(it.stepId, { endTime, duration })) as RespStepRecord;
            const intercepted = handleStopResult(res);
            if (!intercepted) {
              // 특별 스플래시가 없으면 Pause 유지
            }
          } catch (e: unknown) {
            console.error("[useStepPlayback] stopStep error:", e);
            alert(errMsg(e) || "정지 로그 저장에 실패했습니다.");
          } finally {
            // 정지 후에도 최신화 시도
            void reloadTodos();
          }
        }
      } else {
        // 2-1) 다른 항목이 재생 중이던 경우(이전 것부터 정지)
        if (playingKey && playingKey !== it.id) {
          const prevItem = allItems.find(x => x.id === playingKey);
          const prevStepId = prevItem?.stepId ?? null;

          setEndTimes(prev => ({ ...prev, [playingKey]: new Date() }));
          if (prevStepId != null) {
            try {
              const endTime = new Date().toISOString();
              const startTime = startTimes[playingKey];
              const duration = startTime
                ? Math.floor((Date.now() - startTime.getTime()) / 1000)
                : 0;
              const resPrev = (await stopStep(prevStepId, { endTime, duration })) as RespStepRecord;
              const interceptedPrev = handleStopResult(resPrev);
              if (interceptedPrev) {
                // 완료 스플래시면 새로운 재생 시작 안 함
                return;
              }
            } catch (e: unknown) {
              console.error("[useStepPlayback] stopStep(prev) error:", e);
            } finally {
              void reloadTodos();
            }
          }
        }

        // 2-2) 새 항목 재생 시작
        setPlayingKey(it.id);
        setPauseOpen(false);
        setStartTimes(prev => ({ ...prev, [it.id]: new Date() }));
        setEndTimes(prev => {
          const { [it.id]: _, ...rest } = prev;
          return rest;
        });

        if (it.stepId != null) {
          try {
            const startTime = new Date().toISOString();
            const res = (await startStep(it.stepId, { startTime })) as RespStepRecord;
            setLastProgress(res.progress);
          } catch (e) {
            console.error("[useStepPlayback] startStep error:", e);
            alert(errMsg(e) || "시작 중 오류가 발생했습니다.");
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

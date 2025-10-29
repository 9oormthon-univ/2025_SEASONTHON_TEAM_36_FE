// src/pages/home/components/TodayStepsSheet/hooks/useStepPlayback.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { startStep, stopStep } from "@/apis/step";
import { RespStepRecord } from "@/common/types/response/step";
import { useGoalsStore } from "@/pages/home/store/useGoalsStore";
import { PlayingKey } from "@/pages/home/types/steps";

// ---------- helpers (파일 내부에서만 사용) ----------

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

  // 🐸 새로 추가: StepPlayingModal 열림 상태
  const [playingModalOpen, setPlayingModalOpen] = useState(false);

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

  // 🐸 Step 시작: 항상 StepPlayingModal 열기
  const handleAction = async (it: { id: number | string; stepId: number | null }) => {
    if (busyRef.current) return;
    busyRef.current = true;
    try {
      const isPlaying = playingKey === it.id;
      setSelectedStep(it);

      if (!isPlaying) {
        // 새 항목 재생
        setPlayingKey(it.id);
        setStartTimes(prev => ({ ...prev, [it.id]: new Date() }));
        setPlayingModalOpen(true); // 🐸 항상 모달 열기

        if (it.stepId != null) {
          try {
            const startTime = new Date().toISOString();
            const res = (await startStep(it.stepId, { startTime })) as RespStepRecord;
            setLastProgress(res.progress);
          } catch (e) {
            console.error("[useStepPlayback] startStep error:", e);
            alert(e || "시작 중 오류가 발생했습니다.");
          }
        }
        onOpenDailyIfNeeded?.();
      }
    } finally {
      busyRef.current = false;
    }
  };
  // 🐸 모달 안의 “완료” 버튼이 실제 stopStep 수행
  const handleStopFromModal = async () => {
    const it = selectedStep;
    if (!it || !it.stepId) return;
    try {
      const endTime = new Date().toISOString();
      const startTime = startTimes[it.id];
      const duration = startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0;
      const res = (await stopStep(it.stepId, { endTime, duration })) as RespStepRecord;
      handleStopResult(res);
    } catch (e) {
      console.error("[useStepPlayback] stopStep(from modal) error:", e);
      alert(e || "정지 로그 저장에 실패했습니다.");
    } finally {
      setPlayingModalOpen(false);
      setPlayingKey(null);
      void reloadTodos();
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
    playingModalOpen, // 🐸 stepPlayingModal 열림 상태
    setPlayingModalOpen, // 🐸
    handleAction,
    handleStopFromModal, // 🐸 모달 내 “완료” 버튼
    closePause,
    closeGoal,
    closeDay,
  };
}

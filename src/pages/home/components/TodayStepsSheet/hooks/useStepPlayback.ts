// src/pages/home/components/TodayStepsSheet/hooks/useStepPlayback.ts
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { pauseStep, startStep, stopStep } from "@/apis/step";
import { RespStepRecord } from "@/common/types/response/step";
import { useGoalsStore } from "@/pages/home/store/useGoalsStore";
import { PlayingKey } from "@/pages/home/types/steps";

// ---------- helper (파일 내부에서만 사용) ----------
type Group = { items: Array<{ id: string | number; stepId: number | null }> };

export function useStepPlayback({
  goalId,
  groups,
  onOpenDailyIfNeeded,
  refetchTodaySteps,
}: {
  goalId?: number | null;
  groups: Group[];
  onOpenDailyIfNeeded?: () => void;
  refetchTodaySteps?: () => Promise<void>;
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
  const [startTimes, setStartTimes] = useState<Record<string | number, Date>>({});
  const [endTimes, setEndTimes] = useState<Record<string | number, Date>>({});

  // 서버가 돌려 준 최신 진행률(%) 캐시
  const [lastProgress, setLastProgress] = useState<number | null>(null);

  // 스플래시 상태
  const [stepStopOpen, setStepStopOpen] = useState<boolean>(false); // 일시정지가 아닌 "종료" 스플래시임!
  const [goalCompleteOpen, setGoalCompleteOpen] = useState<boolean>(false);
  const [dayCompleteOpen, setDayCompleteOpen] = useState<boolean>(false);
  const [stepPauseOpen, setStepPauseOpen] = useState<boolean>(false);

  // StepPlayingModal 열림 상태
  const [playingModalOpen, setPlayingModalOpen] = useState(false);
  const [lastRecord, setLastRecord] = useState<RespStepRecord | null>(null);

  // 동시 입력 (더블 탭 등)으로 인한 중복 실행 방지 플래그
  const busyRef = useRef(false);

  // ✅ 리로드 대기 플래그(범용): 어떤 모달이든 "전부 닫힌" 타이밍에 1회 리로드
  const pendingReloadRef = useRef(false);
  const pendingStepReloadRef = useRef(false);

  // 모든 아이템(보조 계산)
  const allItems = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const closeStepStop = () => setStepStopOpen(false);
  const closeGoal = () => setGoalCompleteOpen(false);
  const closeDay = () => setDayCompleteOpen(false);
  const closeStepPause = () => setStepPauseOpen(false);

  // ✅ 어떤 모달도 열려 있지 않을 때, 대기 플래그가 켜져 있으면 리로드
  const anyModalOpen =
    playingModalOpen || stepStopOpen || stepPauseOpen || goalCompleteOpen || dayCompleteOpen;

  useEffect(() => {
    if (!anyModalOpen && pendingReloadRef.current) {
      pendingReloadRef.current = false; // 소모
      void reloadTodos();
    }
  }, [anyModalOpen, reloadTodos]);

  useEffect(() => {
    if (!anyModalOpen) {
      if (pendingStepReloadRef.current && refetchTodaySteps) {
        pendingStepReloadRef.current = false;
        void refetchTodaySteps();
      }
    }
  }, [anyModalOpen, refetchTodaySteps]);

  // RespStepRecord 기반으로 직접 판정 (외부 유틸 의존성 제거)
  const handleStopResult = useCallback((res: RespStepRecord) => {
    setLastRecord(res);
    const doneToday = Boolean(res.isCompletedTodaySteps);
    const p = Number(res.progress);
    const progress = Number.isFinite(p) ? p : null;
    const reachedGoal100 = !doneToday && progress != null && progress >= 100;

    if (progress != null) setLastProgress(progress);

    // 1) 오늘 스텝 모두 완료 → DayComplete만
    if (doneToday) {
      setStepStopOpen(false);
      setPlayingKey(null);
      setDayCompleteOpen(true);
      return true;
    }
    // 2) 목표 100% → GoalComplete (단, doneToday가 아닐 때만)
    if (reachedGoal100) {
      setStepStopOpen(false);
      setPlayingKey(null);
      setGoalCompleteOpen(true);
      return true;
    }
    // 3) 그 외 → Pause 유지 (스플래시는 호출측에서)
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
              const startedAt = startTimes[prevKey];
              const now = new Date();
              const endTime = new Date().toISOString();
              const duration = startedAt
                ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000))
                : 0;
              const res = await stopStep(prevStepId, { endTime, duration });
              handleStopResult(res as RespStepRecord);
            }
          } catch (e: unknown) {
            console.error("[useStepPlayback] stop on goal change failed:", e);
          } finally {
            // 이전에는 즉시 reloadTodos(); 지금은 범용 플래그 → 모달이 없으면 즉시, 있으면 닫힐 때 리로드
            pendingReloadRef.current = true;
          }
        })();

        setEndTimes(prev => ({ ...prev, [prevKey]: new Date() }));
        setPlayingKey(null);
      }
      prevGoalRef.current = goalId;
    }
  }, [goalId, playingKey, allItems, handleStopResult, startTimes]);

  // Step 시작: 항상 StepPlayingModal 열기
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
        setPlayingModalOpen(true); // 항상 모달 열기

        if (it.stepId != null) {
          try {
            const startTime = new Date().toISOString();
            const res = (await startStep(it.stepId, { startTime })) as RespStepRecord;
            setLastRecord(res);
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

  // 모달 안의 “완료” 버튼 → 실제 stopStep 수행
  const handleStopFromModal = async () => {
    const it = selectedStep;
    if (!it || !it.stepId) return;
    try {
      const now = new Date();
      const endTime = new Date().toISOString();
      const startedAt = startTimes[it.id];
      const duration = startedAt
        ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000))
        : 0;
      const res = (await stopStep(it.stepId, { endTime, duration })) as RespStepRecord;
      handleStopResult(res);
    } catch (e) {
      console.error("[useStepPlayback] stopStep(from modal) error:", e);
      alert(e || "정지 로그 저장에 실패했습니다.");
    } finally {
      setStepStopOpen(true);
      setPlayingModalOpen(false);
      setPlayingKey(null);
      // 모달(혹은 스플래시) 닫힐 때 1회 리로드
      pendingReloadRef.current = true;
    }
  };

  // 모달 안의 “일시정지” 버튼
  const handlePauseFromModal = async () => {
    const it = selectedStep;
    if (!it || !it.stepId) return;
    if (busyRef.current) return;
    busyRef.current = true;

    try {
      const now = new Date();
      const endTime = new Date().toISOString();
      const startedAt = startTimes[it.id];
      const duration = startedAt
        ? Math.max(0, Math.floor((now.getTime() - startedAt.getTime()) / 1000))
        : 0;
      const res = (await pauseStep(it.stepId, { endTime, duration })) as RespStepRecord;
      setLastRecord(res);
      console.info("[useStepPlayback] pauseStep result:", res);

      // UI 상태 업데이트
      setEndTimes(prev => ({ ...prev, [it.id]: now }));
      setPlayingKey(null); // 이후 재개 시 새 타이머 구간 시작 위해 재생 상태 해제
    } catch (e) {
      console.error("[useStepPlayback] pauseStep(from modal) error:", e);
      alert(e || "일시정지 중 오류가 발생했습니다.");
    } finally {
      busyRef.current = false;
      setStepPauseOpen(true);
      setPlayingModalOpen(false);
      // 모달(혹은 스플래시) 닫힐 때 1회 리로드
      // pendingReloadRef.current = true;
      pendingStepReloadRef.current = true; // todaystep만 reload
    }
  };

  return {
    selectedStep,
    playingKey,
    startTimes,
    endTimes,
    lastProgress,
    lastRecord,
    stepStopOpen,
    goalCompleteOpen,
    dayCompleteOpen,
    playingModalOpen,
    stepPauseOpen,
    setPlayingModalOpen,
    handleAction,
    handleStopFromModal,
    handlePauseFromModal,
    closeStepStop,
    closeGoal,
    closeDay,
    closeStepPause,
  };
}

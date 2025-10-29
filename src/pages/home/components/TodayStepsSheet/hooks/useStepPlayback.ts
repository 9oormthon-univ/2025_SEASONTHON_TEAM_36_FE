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
  const [startTimes, setStartTimes] = useState<Record<string | number, Date>>({});
  const [endTimes, setEndTimes] = useState<Record<string | number, Date>>({});

  // 서버가 돌려 준 최신 진행률(%) 캐시
  const [lastProgress, setLastProgress] = useState<number | null>(null);

  // 스플래시 상태
  const [stepStopOpen, setStepStopOpen] = useState(false); // 일시정지가 아닌 "종료" 스플래시임!
  const [goalCompleteOpen, setGoalCompleteOpen] = useState(false);
  const [dayCompleteOpen, setDayCompleteOpen] = useState(false);
  const [stepPauseOpen, setStepPauseOpen] = useState(false);

  // 🐸 새로 추가: StepPlayingModal 열림 상태
  const [playingModalOpen, setPlayingModalOpen] = useState(false);
  const [lastRecord, setLastRecord] = useState<RespStepRecord | null>(null); // 🐸 추가

  // 동시 입력 (더블 탭 등)으로 인한 중복 실행 방지 플래그
  const busyRef = useRef(false);

  // 보조 계산) playingKey에서 대응되는 stepId를 찾거나, 이전 재생 중 아이템을 끊을 때 사용
  const allItems = useMemo(() => groups.flatMap(g => g.items), [groups]);

  const closeStepStop = () => setStepStopOpen(false);
  const closeGoal = () => setGoalCompleteOpen(false);
  const closeDay = () => setDayCompleteOpen(false);
  const closeStepPause = () => setStepPauseOpen(false);

  // RespStepRecord 기반으로 직접 판정 (외부 유틸 의존성 제거)
  const handleStopResult = useCallback((res: RespStepRecord) => {
    setLastRecord(res); // 🐸 추가
    const doneToday = Boolean(res.isCompletedTodaySteps);
    const p = Number(res.progress);
    const progress = Number.isFinite(p) ? p : null;
    const reachedGoal100 = !doneToday && progress != null && progress >= 100;

    if (progress != null) setLastProgress(progress);

    // void reloadTodos();

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
    // 3) 그 외 → Pause 유지
    // setStepStopOpen(true); // handleStopFromModal에서 처리
    // setPlayingKey(null);
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
              // const endTime = toKstIsoString(now);
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
            void reloadTodos();
          }
        })();

        setEndTimes(prev => ({ ...prev, [prevKey]: new Date() }));
        setPlayingKey(null);
      }
      prevGoalRef.current = goalId;
    }
  }, [goalId, playingKey, allItems, handleStopResult, reloadTodos, startTimes]);

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
            // const startTime = toKstIsoString(new Date());
            const startTime = new Date().toISOString();
            const res = (await startStep(it.stepId, { startTime })) as RespStepRecord;
            setLastRecord(res); // 🐸 추가
            console.info("[useStepPlayback] startStep result:", res);
            // setLastProgress(res.progress);
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
      // void reloadTodos();
    }
  };

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
      setLastRecord(res); // 🐸 추가
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
      // void reloadTodos(); 삭제함
    }
  };

  return {
    selectedStep,
    playingKey,
    startTimes,
    endTimes,
    lastProgress,
    lastRecord, // 🐸 추가
    stepStopOpen,
    goalCompleteOpen,
    dayCompleteOpen,
    playingModalOpen, // 🐸 stepPlayingModal 열림 상태
    stepPauseOpen,
    setPlayingModalOpen, // 🐸
    handleAction,
    handleStopFromModal, // 🐸 모달 내 “완료” 버튼
    handlePauseFromModal, // 🐸 모달 내 “일시정지” 버튼
    closeStepStop,
    closeGoal,
    closeDay,
    closeStepPause,
  };
}

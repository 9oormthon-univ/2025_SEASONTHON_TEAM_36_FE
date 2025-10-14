import React from "react";
import styled from "styled-components";

import { startStep, stopStep } from "@/apis/step"; // 서버 기록 API
import dragUp from "@/assets/images/drag-up.svg";

import BottomSheet from "../../../layout/BottomSheet";
import DailyCheckInModal from "../modals/DailyCheckInModal";
import DayCompleteSplash from "../modals/DayCompleteSplash";
import GoalCompleteSplash from "../modals/GoalCompleteSplash";
import PauseSplash from "../modals/PauseSplash";
import { applyPlayingState } from "../utils/steps";
import { getTodayAndPastLists } from "../utils/stepsView";
import { getDailyShown, markDailyShown } from "../utils/storage";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";

const PEEK_HEIGHT = 58;

export default function TodayStepsSheet({ goalId, onHeightChange, onStepCompl }) {
  const [open, setOpen] = React.useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  // 하루 1회 체크인 모달
  const [modalOpen, setModalOpen] = React.useState(false);
  const [dailyShown, setDailyShown] = React.useState(false);

  // 서버 데이터 (오늘/과거 분리)
  const [parted, setParted] = React.useState({ meta: null, today: [], past: [] });
  const [loading, setLoading] = React.useState(false);

  // Step/재생 상태
  const [selectedStep, setSelectedStep] = React.useState(null);
  const [playingKey, setPlayingKey] = React.useState(null);

  // Splash 모달
  const [pauseOpen, setPauseOpen] = React.useState(false);
  const [goalCompleteOpen, setGoalCompleteOpen] = React.useState(false);
  const [dayCompleteOpen, setDayCompleteOpen] = React.useState(false);

  // 진행률
  const [lastProgress, setLastProgress] = React.useState(null);

  // 시작/종료 시각 저장
  const [startTimes, setStartTimes] = React.useState({});
  const [endTimes, setEndTimes] = React.useState({});

  // 동작 중복 방지
  const actionBusyRef = React.useRef(false);

  // 오늘 DailyCheckInModal 이미 보여줬는지 확인
  React.useEffect(() => {
    setDailyShown(getDailyShown());
  }, []);

  const markDaily = React.useCallback(() => {
    markDailyShown();
    setDailyShown(true);
  }, []);

  // 서버에서 '오늘/과거' 분리 리스트 로드
  React.useEffect(() => {
    let alive = true;
    if (goalId == null) {
      setParted({ meta: null, today: [], past: [] });
      return;
    }
    (async () => {
      try {
        setLoading(true);
        const res = await getTodayAndPastLists(goalId);
        if (alive) setParted(res ?? { meta: null, today: [], past: [] });
      } catch (e) {
        console.error("[TodayStepsSheet] getTodayAndPastLists error:", e);
        if (alive) {
          setParted({ meta: null, today: [], past: [] });
          alert(e?.message ?? "할 일(step) 목록을 불러오지 못했습니다.");
        }
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [goalId]);

  // 리스트 → UI 아이템 (기본 state=pause) + stepId 포함
  const toPaused = React.useCallback(
    prefix => (s, i) => ({
      id: `${prefix}-${s.stepId ?? s.stepOrder ?? i}`, // 내부용 고유키
      title: s.description ?? "",
      state: "pause",
      stepId: s.stepId ?? null, // 서버 호출용
    }),
    [],
  );

  const baseGroups = React.useMemo(() => {
    const todayItems = parted.today.map(toPaused("today"));
    const pastItems = parted.past.map(toPaused("past"));
    return [
      { id: "today", title: "오늘 할 일", defaultOpen: true, items: todayItems },
      { id: "past", title: "이월된 일", defaultOpen: true, items: pastItems },
    ];
  }, [parted.today, parted.past, toPaused]);

  // 재생 상태 반영
  const groups = React.useMemo(
    () => applyPlayingState(baseGroups, playingKey),
    [baseGroups, playingKey],
  );

  // ==== 공통: stop 응답 처리(렌더링 기준을 stopStep으로) ====
  // isCompletedTodaySteps가 true면 GoalCompleteSplash는 절대 띄우지 않음
  const processStopResult = React.useCallback(res => {
    const rawDone = res?.isCompletedTodaySteps;
    // 문자열 "true"/"false"까지 안전하게 처리
    const doneToday = rawDone === true || rawDone === "true" || rawDone === 1 || rawDone === "1";

    const p = Number(res?.progress);
    if (Number.isFinite(p)) setLastProgress(p);

    // 1) 오늘 스텝 모두 완료 → DayComplete만 (GoalComplete는 절대 X)
    if (doneToday) {
      setModalOpen(false);
      setPauseOpen(false);
      setPlayingKey(null);
      setDayCompleteOpen(true);
      return true;
    }

    // 2) 목표 100% 달성 → GoalComplete (단, doneToday가 아닐 때만)
    if (!doneToday && Number.isFinite(p) && p >= 100) {
      setModalOpen(false);
      setPauseOpen(false);
      setPlayingKey(null);
      setGoalCompleteOpen(true);
      return true;
    }

    // 3) 둘 다 아니면 PauseSplash 유지
    return false;
  }, []);

  // goalId 전환 시 재생 종료 기록(+ 서버 stop)
  const prevGoalRef = React.useRef(goalId);
  React.useEffect(() => {
    if (prevGoalRef.current !== goalId) {
      const prevKey = playingKey;
      if (prevKey) {
        const allItems = groups.flatMap(g => g.items);
        const prevItem = allItems.find(it => it.id === prevKey);
        const prevStepId = prevItem?.stepId ?? null;

        (async () => {
          try {
            if (prevStepId != null) {
              const res = await stopStep(prevStepId);
              processStopResult(res);
            }
          } catch (e) {
            console.error("[TodayStepsSheet] stop on goal change failed:", e);
          }
        })();

        setEndTimes(prev => ({ ...prev, [prevKey]: new Date() }));
        setPlayingKey(null);
      }
      prevGoalRef.current = goalId;
    }
  }, [goalId, playingKey, groups, processStopResult]);

  // 액션 (재생/정지)
  const handleAction = async it => {
    if (actionBusyRef.current) return;
    actionBusyRef.current = true;
    try {
      const isPlaying = playingKey === it.id;
      setSelectedStep(it);

      if (isPlaying) {
        // ===== 정지 처리 =====
        setEndTimes(prev => ({ ...prev, [it.id]: new Date() }));
        setPauseOpen(true); // 일단 PauseSplash를 띄우되,
        setModalOpen(false);
        setPlayingKey(null); // 재생 해제

        if (it.stepId != null) {
          try {
            const res = await stopStep(it.stepId);
            // stop 응답으로 스플래시 판정(우선순위 처리)
            const intercepted = processStopResult(res);
            if (!intercepted) {
              // 특별 스플래시가 없으면 PauseSplash 유지
            }
          } catch (e) {
            console.error("[TodayStepsSheet] stopStep error:", e);
            alert(e?.message ?? "정지 로그 저장에 실패했습니다.");
          }
        }
      } else {
        // ===== 다른 항목 재생 중이면 먼저 정지 =====
        if (playingKey && playingKey !== it.id) {
          const allItems = groups.flatMap(g => g.items);
          const prevItem = allItems.find(x => x.id === playingKey);
          const prevStepId = prevItem?.stepId ?? null;

          setEndTimes(prev => ({ ...prev, [playingKey]: new Date() }));
          if (prevStepId != null) {
            try {
              const resPrev = await stopStep(prevStepId);
              // 전 항목 stop 응답도 동일 로직으로 처리
              const interceptedPrev = processStopResult(resPrev);
              if (interceptedPrev) {
                // 만약 여기서 Day/Goal 완료가 뜨면, 새 재생은 시작하지 않음
                return;
              }
            } catch (e) {
              console.error("[TodayStepsSheet] stopStep(prev) error:", e);
            }
          }
        }

        // ===== 새 항목 재생 시작 =====
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
            // ★ 여기서는 스플래시를 띄우지 않는다(렌더링 기준을 stop으로 변경)
            const prog = Number(res?.progress);
            if (Number.isFinite(prog)) setLastProgress(prog);
            onStepCompl?.();
          } catch (e) {
            console.error("[TodayStepsSheet] startStep error:", e);
            alert(e?.message ?? "시작 로그 저장에 실패했습니다.");
          }
        }

        if (!dailyShown) setModalOpen(true);
      }
    } finally {
      actionBusyRef.current = false;
    }
  };

  const handleCloseDaily = React.useCallback(() => {
    setModalOpen(false);
    markDaily();
  }, [markDaily]);

  return (
    <>
      <BottomSheet
        open={open}
        onOpen={openSheet}
        onClose={closeSheet}
        ariaLabel="할 일 목록"
        peekHeight={PEEK_HEIGHT}
        size="32vh"
        onHeightChange={onHeightChange}
      >
        {open ? (
          <SheetBody>
            <ScrollArea role="list" aria-busy={loading}>
              {groups.map(g => (
                <SheetListSection key={g.id} title={g.title} defaultOpen={g.defaultOpen}>
                  <TodayStepsList
                    items={g.items}
                    onAction={handleAction}
                    startTimes={startTimes}
                    endTimes={endTimes}
                  />
                </SheetListSection>
              ))}
            </ScrollArea>
          </SheetBody>
        ) : (
          <Title className="typo-h3">우물 밖으로 나갈 준비</Title>
        )}
      </BottomSheet>

      {!open && (
        <FloatingArrow
          src={dragUp}
          alt=""
          aria-hidden="true"
          style={{ "--peek": `${PEEK_HEIGHT}px`, "--gap": "2%" }}
        />
      )}

      <DailyCheckInModal open={modalOpen} onClose={handleCloseDaily} />

      <PauseSplash
        open={pauseOpen}
        onClose={() => setPauseOpen(false)}
        progress={lastProgress ?? 0}
      />

      <GoalCompleteSplash open={goalCompleteOpen} onClose={() => setGoalCompleteOpen(false)} />
      <DayCompleteSplash open={dayCompleteOpen} onClose={() => setDayCompleteOpen(false)} />
    </>
  );
}

const SheetBody = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  margin: 0 2%;
`;

const ScrollArea = styled.div`
  overflow: auto;
  padding: 4px 8px 12px;
`;

const FloatingArrow = styled.img`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(
    env(safe-area-inset-bottom, 0px) + var(--peek, 58px) + var(--gap, 14px) + var(--navbar-height)
  );
  width: 14px;
  height: auto;
  pointer-events: none;
  z-index: 9999;
`;

const Title = styled.h3`
  margin: 8px 30px;
  color: var(--text-1);
`;

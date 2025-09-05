// src/pages/home/components/TodayStepsSheet.jsx
import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";
import arrowDown from "@/assets/images/arrow-down.svg";
import dragUp from "@/assets/images/drag-up.svg";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";

import DailyCheckInModal from "../modals/DailyCheckInModal";
import PauseSplash from "../modals/PauseSplash";
import { getDailyShown, markDailyShown } from "../utils/storage";
import { applyPlayingState } from "../utils/steps";
import { startStep, stopStep } from "@/apis/step"; // 서버 기록 API
import { getTodayAndPastLists } from "../utils/stepsView";

const PEEK_HEIGHT = 58;

export default function TodayStepsSheet({ goalId, onHeightChange }) {
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

  // PauseSplash 모달
  const [pauseOpen, setPauseOpen] = React.useState(false);

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
    return () => { alive = false; };
  }, [goalId]);

  // 리스트 → UI 아이템 (기본 state=pause) + stepId 포함
  const toPaused = React.useCallback((prefix) => (s, i) => ({
    id: `${prefix}-${s.stepId ?? s.stepOrder ?? i}`, // 내부용 고유키
    title: s.description ?? "",
    state: "pause",
    stepId: s.stepId ?? null, // 서버 호출용
  }), []);

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
    [baseGroups, playingKey]
  );

  // goalId 전환 시 재생 종료 기록(+ 서버 stop)
  const prevGoalRef = React.useRef(goalId);
  React.useEffect(() => {
    if (prevGoalRef.current !== goalId) {
      const prevKey = playingKey;
      if (prevKey) {
        // 현재 그룹에서 이전 아이템 찾아 stepId 획득
        const allItems = groups.flatMap((g) => g.items);
        const prevItem = allItems.find((it) => it.id === prevKey);
        const prevStepId = prevItem?.stepId ?? null;

        (async () => {
          try {
            if (prevStepId != null) await stopStep(prevStepId);
          } catch (e) {
            console.error("[TodayStepsSheet] stop on goal change failed:", e);
          }
        })();

        // 로컬 종료 기록
        setEndTimes((prev) => ({ ...prev, [prevKey]: new Date() }));
        setPlayingKey(null);
      }
      prevGoalRef.current = goalId;
    }
  }, [goalId, playingKey, groups]);

  // 액션 (재생/정지) → 서버 start/stop 기록
  const handleAction = async (it) => {
    if (actionBusyRef.current) return;
    actionBusyRef.current = true;
    try {
      const isPlaying = playingKey === it.id;
      setSelectedStep(it);

      if (isPlaying) {
        // ===== 정지 처리 =====
        setPauseOpen(true);
        setModalOpen(false);
        setPlayingKey(null);
        setEndTimes((prev) => ({ ...prev, [it.id]: new Date() }));

        if (it.stepId != null) {
          try {
            await stopStep(it.stepId);
          } catch (e) {
            console.error("[TodayStepsSheet] stopStep error:", e);
            alert(e?.message ?? "정지 로그 저장에 실패했습니다.");
          }
        }
      } else {
        // 다른 항목이 재생 중이면 일단 종료 
        if (playingKey && playingKey !== it.id) {
          // 이전 아이템 찾아 stepId
          const allItems = groups.flatMap((g) => g.items);
          const prevItem = allItems.find((x) => x.id === playingKey);
          const prevStepId = prevItem?.stepId ?? null;

          setEndTimes((prev) => ({ ...prev, [playingKey]: new Date() }));
          if (prevStepId != null) {
            try {
              await stopStep(prevStepId);
            } catch (e) {
              console.error("[TodayStepsSheet] stopStep(prev) error:", e);
            }
          }
        }

        // 새 항목 재생 시작 
        setPlayingKey(it.id);
        setPauseOpen(false);
        setStartTimes((prev) => ({ ...prev, [it.id]: new Date() }));
        // 과거 종료 시각 초기화
        setEndTimes((prev) => {
          const { [it.id]: _, ...rest } = prev;
          return rest;
        });

        if (it.stepId != null) {
          try {
            await startStep(it.stepId);
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
            <TopBar>
              <TopRow>
                <CloseDownBtn onClick={closeSheet} aria-label="내려서 닫기">
                  <img src={arrowDown} alt="arrow-down" width={14} style={{ height: "auto" }} />
                </CloseDownBtn>
              </TopRow>
            </TopBar>

            <ScrollArea role="list" aria-busy={loading}>
              {groups.map((g) => (
                <SheetListSection key={g.id} title={g.title} defaultOpen={g.defaultOpen}>
                  <TodayStepsList
                    items={g.items}          // 각 item에 stepId 포함
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

      <DailyCheckInModal
        open={modalOpen}
        onClose={handleCloseDaily}
        title={parted.meta?.title ?? "목표"}
        step={selectedStep}
        isPlaying={!!playingKey}
      />

      <PauseSplash open={pauseOpen} onClose={() => setPauseOpen(false)} step={selectedStep} />
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

const TopBar = styled.div`
  position: sticky;
  top: 0;
  z-index: 1;
  background: var(--bg-1);
  border-bottom: 1px solid var(--bg-2);
`;

const TopRow = styled.div`
  position: relative;
  min-height: 20px;
`;

const CloseDownBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 0px;
  appearance: none;
  border: 0;
  background: transparent;
  cursor: pointer;
  color: var(--text-2);
  font-size: 18px;
  line-height: 1;
  padding: 0 6px;
  margin: 0 1% 0 0;
  border-radius: 8px;
  &:hover { background: var(--text-w2); }
`;

const ScrollArea = styled.div`
  overflow: auto;
  padding: 4px 8px 12px;
`;

const FloatingArrow = styled.img`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: calc(env(safe-area-inset-bottom, 0px) + var(--peek, 58px) + var(--gap, 14px) + var(--navbar-height));
  width: 14px;
  height: auto;
  pointer-events: none;
  z-index: 9999;
`;

const Title = styled.h3`
  margin: 8px 30px;
  color: var(--text-1);
`;

// src/pages/home/components/TodayStepsSheet.tsx
import { useEffect, useMemo } from "react";
import styled, { CSSProperties } from "styled-components";

import dragUp from "@/assets/images/drag-up.svg";

import BottomSheet from "../../../../layout/BottomSheet";
import DailyCheckInModal from "../../modals/DailyCheckInModal";
import DayCompleteSplash from "../../modals/DayCompleteSplash";
import GoalCompleteSplash from "../../modals/GoalCompleteSplash";
import StepPauseSplash from "../../modals/StepPauseSplash";
import StepPlayingModal from "../../modals/StepPlayingModal";
import StepStopSplash from "../../modals/StepStopSplash";
import { useActiveGoalStore } from "../../store/useActiveGoalStore";
import { useBottomSheetStore } from "../../store/useBottomSheetStore";
import { useDailyCheckIn } from "./hooks/useDailyCheckIn";
import { useStepPlayback } from "./hooks/useStepPlayback";
import { useTodaySteps } from "./hooks/useTodaySteps";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";
import { applyPlayingState } from "./utils/stepState";

export default function TodayStepsSheet() {
  const open = useBottomSheetStore(s => s.open);
  const peekHeight = useBottomSheetStore(s => s.peekHeightPx);
  const { activeId } = useActiveGoalStore();

  // 🍋‍🟩 이제 groups가 바로 내려옴
  const { loading, error, groups: baseGroups } = useTodaySteps(activeId);

  useEffect(() => {
    if (!error) return;
    const msg = error instanceof Error ? error.message : JSON.stringify(error);
    alert(msg || "할 일(step) 목록을 불러오지 못했습니다.");
  }, [error]);

  const { modalOpen, maybeOpen, closeAndMark } = useDailyCheckIn();

  const {
    playingKey,
    startTimes,
    endTimes,
    lastProgress,
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
  } = useStepPlayback({
    goalId: activeId,
    groups: baseGroups,
    onOpenDailyIfNeeded: () => maybeOpen(),
  });

  const groups = useMemo(() => applyPlayingState(baseGroups, playingKey), [baseGroups, playingKey]);

  return (
    <>
      <BottomSheet>
        {open ? (
          <SheetBody>
            <ScrollArea role="list" aria-busy={loading}>
              {groups.map(g => (
                <SheetListSection key={g.key} title={g.title}>
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
          style={{ "--peek": `${peekHeight}px`, "--gap": "2%" } as CSSProperties}
        />
      )}

      <DailyCheckInModal open={modalOpen} onClose={closeAndMark} />

      <StepPlayingModal
        open={playingModalOpen}
        onClose={() => setPlayingModalOpen(false)}
        onConfirm={handleStopFromModal}
        onPause={handlePauseFromModal}
      />

      <StepStopSplash open={stepStopOpen} onClose={closeStepStop} progress={lastProgress ?? 0} />
      <GoalCompleteSplash open={goalCompleteOpen} onClose={closeGoal} />
      <DayCompleteSplash open={dayCompleteOpen} onClose={closeDay} />
      <StepPauseSplash open={stepPauseOpen} onClose={closeStepPause} />
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
  overflow-y: auto;
  overflow-x: hidden;
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

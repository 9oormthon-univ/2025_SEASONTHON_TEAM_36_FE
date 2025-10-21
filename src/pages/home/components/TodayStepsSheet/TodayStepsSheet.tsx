// src/pages/home/components/TodayStepsSheet.tsx
import { useMemo, useState } from "react";
import styled, { CSSProperties } from "styled-components";

import dragUp from "@/assets/images/drag-up.svg";

import BottomSheet from "../../../../layout/BottomSheet";
import DailyCheckInModal from "../../modals/DailyCheckInModal";
import DayCompleteSplash from "../../modals/DayCompleteSplash";
import GoalCompleteSplash from "../../modals/GoalCompleteSplash";
import PauseSplash from "../../modals/PauseSplash";
import { useActiveGoalStore } from "../../store/useActiveGoalStore";
import { useDailyCheckIn } from "./hooks/useDailyCheckIn";
import { useStepPlayback } from "./hooks/useStepPlayback";
import { useStepsData } from "./hooks/useStepsData";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";
import { applyPlayingState } from "./utils/stepState";

const PEEK_HEIGHT = 58;

export default function TodayStepsSheet({
  onHeightChange,
  onStepCompl,
}: {
  onHeightChange?: (h: number) => void;
  onStepCompl?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  // 전역 activeId 사용
  const { activeId } = useActiveGoalStore();

  // 1) 데이터 로드
  const { loading, baseGroups } = useStepsData(activeId); // ✅ store 값으로 호출

  // 2) 하루 1회 체크인
  const { modalOpen, maybeOpen, closeAndMark } = useDailyCheckIn();

  // 3) 재생/정지 상태 및 스플래시
  const {
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
  } = useStepPlayback({
    goalId: activeId, // store 값으로 전달
    groups: baseGroups,
    onStepCompl,
    onOpenDailyIfNeeded: () => maybeOpen(),
  });

  const groups = useMemo(() => applyPlayingState(baseGroups, playingKey), [baseGroups, playingKey]);

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
          style={{ "--peek": `${PEEK_HEIGHT}px`, "--gap": "2%" } as CSSProperties}
        />
      )}

      {/* 하루 1회 체크인 모달 */}
      <DailyCheckInModal open={modalOpen} onClose={closeAndMark} />

      {/* 스플래시들 */}
      <PauseSplash open={pauseOpen} onClose={closePause} progress={lastProgress ?? 0} />
      <GoalCompleteSplash open={goalCompleteOpen} onClose={closeGoal} />
      <DayCompleteSplash open={dayCompleteOpen} onClose={closeDay} />
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

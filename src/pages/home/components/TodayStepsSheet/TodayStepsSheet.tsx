// src/pages/home/components/TodayStepsSheet.tsx
import { useMemo } from "react";
import styled, { CSSProperties } from "styled-components";

import dragUp from "@/assets/images/drag-up.svg";

import BottomSheet from "../../../../layout/BottomSheet";
// 스플래시 및 모달 열림 상태 여기서 관리
import DailyCheckInModal from "../../modals/DailyCheckInModal";
import DayCompleteSplash from "../../modals/DayCompleteSplash";
import GoalCompleteSplash from "../../modals/GoalCompleteSplash";
import PauseSplash from "../../modals/PauseSplash";
import StepPlayingModal from "../../modals/StepPlayingModal";
import { useActiveGoalStore } from "../../store/useActiveGoalStore";
import { useBottomSheetStore } from "../../store/useBottomSheetStore";
import { useDailyCheckIn } from "./hooks/useDailyCheckIn";
import { useSheetStepsView } from "./hooks/useSheetStepsView";
import { useStepPlayback } from "./hooks/useStepPlayback";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";
import { applyPlayingState } from "./utils/stepState";

export default function TodayStepsSheet() {
  // store에서 필요한 것만 가져옴
  const open = useBottomSheetStore(s => s.open);
  const peekHeight = useBottomSheetStore(s => s.peekHeightPx);

  // 전역 activeId 사용
  const { activeId } = useActiveGoalStore();

  // 1) 데이터 로드
  const { loading, baseGroups } = useSheetStepsView(activeId);

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
    playingModalOpen, // 🐸 새 상태
    setPlayingModalOpen, // 🐸 새 상태 제어
    handleAction, // step 시작 → 모달 오픈
    handleStopFromModal, // 🐸 모달 내부 완료 버튼
    closePause,
    closeGoal,
    closeDay,
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
                    onAction={handleAction} // 🐸 handleAction 동작 수정됨
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

      {/* 하루 1회 체크인 모달 */}
      <DailyCheckInModal open={modalOpen} onClose={closeAndMark} />

      {/* 🐸 Step 진행 중 모달 (항상 Step 시작 시 오픈) */}
      <StepPlayingModal
        open={playingModalOpen}
        onClose={() => setPlayingModalOpen(false)}
        onConfirm={handleStopFromModal} // 🐸 완료 버튼 → stopStep
      />

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
  overflow-y: auto; /* 세로 스크롤 허용 */
  overflow-x: hidden; /* 가로 스크롤 차단 */
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

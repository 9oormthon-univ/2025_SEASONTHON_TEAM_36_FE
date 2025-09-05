// src/pages/home/components/TodayStepsSheet.jsx
import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";
import arrowDown from "@/assets/images/arrow-down.svg";
import dragUp from "@/assets/images/drag-up.svg";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";

import homeGoals from "../store/todos.mock.json";
import DailyCheckInModal from "../modals/DailyCheckInModal";
import PauseSplash from "../modals/PauseSplash";
import { getDailyShown, markDailyShown } from "../utils/storage";
import { buildBaseGroupsFromSteps, applyPlayingState } from "../utils/steps";

const PEEK_HEIGHT = 58;

/** !!! API !!! 하드코딩된 steps 포함 샘플 데이터 */
const SAMPLE = {
  dDay: "D-10",
  title: "우물밖개구리 프로젝트",
  endDate: "2025-09-05",
  progressText: "개구리가 햇빛을 보기 시작했어요!",
  progress: 50,
  steps: [
    { stepDate: "2025-09-02", stepOrder: 1, description: "ToDo ERD 설계", count: 0, isCompleted: false },
    { stepDate: "2025-09-03", stepOrder: 2, description: "ToDo ERD 설계2", count: 0, isCompleted: false },
    { stepDate: "2025-09-04", stepOrder: 3, description: "ToDo ERD 설계3", count: 0, isCompleted: false },
    { stepDate: "2025-09-05", stepOrder: 4, description: "ToDo ERD 설계4", count: 0, isCompleted: false },
    { stepDate: "2025-09-05", stepOrder: 5, description: "ToDo ERD 설계5", count: 0, isCompleted: false },
    { stepDate: "2025-09-06", stepOrder: 6, description: "ToDo ERD 설계6", count: 0, isCompleted: false },
  ],
};

export default function TodayStepsSheet({ goalId, onHeightChange }) {
  const [open, setOpen] = React.useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  // 하루 1회 체크인 모달
  const [modalOpen, setModalOpen] = React.useState(false);
  const [dailyShown, setDailyShown] = React.useState(false);

  // Step/재생 상태
  const [selectedStep, setSelectedStep] = React.useState(null);
  const [playingKey, setPlayingKey] = React.useState(null);

  // PauseSplash 모달
  const [pauseOpen, setPauseOpen] = React.useState(false);

  // 시작/종료 시각 저장
  const [startTimes, setStartTimes] = React.useState({});
  const [endTimes, setEndTimes] = React.useState({});

  // 오늘 DailyCheckInModal 이미 보여줬는지 확인
  React.useEffect(() => {
    setDailyShown(getDailyShown());
  }, []);

  const markDaily = React.useCallback(() => {
    markDailyShown();
    setDailyShown(true);
  }, []);

  // 부모에서 내려준 id 사용(+ 폴백)
  const targetId = React.useMemo(
    () => (goalId ?? homeGoals?.contents?.[0]?.id ?? null),
    [goalId]
  );

  // !!! API !!! 더미 데이터 사용
  const data = SAMPLE;

  // 섹션 그룹핑 (기본은 전부 pause)
  const baseGroups = React.useMemo(
    () => buildBaseGroupsFromSteps(data?.steps ?? []),
    [data]
  );

  // 재생 상태 반영
  const groups = React.useMemo(
    () => applyPlayingState(baseGroups, playingKey),
    [baseGroups, playingKey]
  );

  // goal 전환 시 재생 종료 기록
  const prevTargetRef = React.useRef(targetId);
  React.useEffect(() => {
    if (prevTargetRef.current !== targetId) {
      if (playingKey) {
        setEndTimes((prev) => ({ ...prev, [playingKey]: new Date() }));
        setPlayingKey(null);
      }
      prevTargetRef.current = targetId;
    }
  }, [targetId, playingKey]);

  // 액션 (재생/정지)
  const handleAction = (it) => {
    const isPlaying = playingKey === it.id;
    setSelectedStep(it);

    if (isPlaying) {
      // 정지
      setPauseOpen(true);
      setModalOpen(false);
      setPlayingKey(null);
      setEndTimes((prev) => ({ ...prev, [it.id]: new Date() }));
    } else {
      // 다른 step이 재생 중이면 종료 기록
      if (playingKey && playingKey !== it.id) {
        setEndTimes((prev) => ({ ...prev, [playingKey]: new Date() }));
      }
      // 새 항목 재생
      setPlayingKey(it.id);
      setPauseOpen(false);
      setStartTimes((prev) => ({ ...prev, [it.id]: new Date() }));
      // 과거 종료 시각 초기화(선택)
      setEndTimes((prev) => {
        const { [it.id]: _, ...rest } = prev;
        return rest;
      });
      // 하루 1회 체크인 모달
      if (!dailyShown) setModalOpen(true);
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

            <ScrollArea role="list">
              {groups.map((g) => (
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

      <DailyCheckInModal
        open={modalOpen}
        onClose={handleCloseDaily}
        title={data?.title ?? "목표"}
        step={selectedStep}
        isPlaying={!!playingKey}
      />

      <PauseSplash open={pauseOpen} onClose={() => setPauseOpen(false)} step={selectedStep} />
    </>
  );
}

/* ===== styled ===== */
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

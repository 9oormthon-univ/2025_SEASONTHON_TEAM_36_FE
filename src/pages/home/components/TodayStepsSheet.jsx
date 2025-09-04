import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";
import arrowDown from "@/assets/images/arrow-down.svg";
import dragUp from "@/assets/images/drag-up.svg";
import SheetListSection from "./SheetListSection";
import TodayStepsList from "./TodayStepsList";

import homeGoals from "../store/todos.mock.json";
import { selectStepsByGoalId } from "../store/selectStepsByGoalId";
import DailyCheckInModal from "../modals/DailyCheckInModal";

const PEEK_HEIGHT = 58; // 닫힘 상태에서 보일 높이 (BottomSheet의 peekHeight와 동일)

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

  // DailyCheckInModal 관련
  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedStep, setSelectedStep] = React.useState(null);
  const [playingKey, setPlayingKey] = React.useState(null);

  // 부모에서 내려준 id 사용(+ 폴백)
  const targetId = React.useMemo(
    () => (goalId ?? homeGoals?.contents?.[0]?.id ?? null),
    [goalId]
  );

  // !!! API !!!
  // 더미 데이터 사용
  const data = SAMPLE;

  // ===== 1) 섹션 분류(오늘/미래=prep, 과거=carried) + 모든 아이템 기본 pause =====
  const baseGroups = React.useMemo(() => {
    if (!data) {
      return [
        { id: "prep", title: "우물 밖으로 나갈 준비", defaultOpen: true, items: [] },
        { id: "carried", title: "이월된 일", defaultOpen: true, items: [] },
      ];
    }

    const parseISODateLocal = (iso) => {
      if (!iso || typeof iso !== "string") return null;
      const [y, m, d] = iso.split("-").map(Number);
      if (!y || !m || !d) return null;
      return new Date(y, m - 1, d);
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = (iso) => {
      const dt = parseISODateLocal(iso);
      if (!dt) return false;
      dt.setHours(0, 0, 0, 0);
      return dt.getTime() === today.getTime();
    };
    const isFuture = (iso) => {
      const dt = parseISODateLocal(iso);
      if (!dt) return false;
      dt.setHours(0, 0, 0, 0);
      return dt.getTime() > today.getTime();
    };

    // 미완료 스텝만 사용
    const allSteps = Array.isArray(data.steps) ? data.steps : [];
    const steps = allSteps.filter((s) => s && s.isCompleted === false);

    const toPausedItem = (prefix) => (s, i) => ({
      id: `${prefix}-${s.stepOrder ?? i ?? 0}`,
      title: s.description ?? "",
      state: "pause", // 기본 상태는 전부 pause
    });

    // steps 중 미래는 제외
    const nonFuture = steps.filter((s) => !isFuture(s.stepDate));
    // 오늘
    const prepItems = nonFuture
      .filter((s) => isToday(s.stepDate))
      .map(toPausedItem("prep"));
    // 과거
    const carriedItems = nonFuture
      .filter((s) => !isToday(s.stepDate))
      .map(toPausedItem("carried"));

    return [
      { id: "prep", title: "우물 밖으로 나갈 준비", defaultOpen: true, items: prepItems },
      { id: "carried", title: "이월된 일", defaultOpen: true, items: carriedItems },
    ];
  }, [data]);

  // goalId 바뀌면 모두 pause로 초기화
  React.useEffect(() => {
    setPlayingKey(null);
  }, [targetId]);

  // 렌더링 시, 현재 playingKey에 맞춰 상태 반영
  const groups = React.useMemo(() => {
    return baseGroups.map((g) => ({
      ...g,
      items: g.items.map((it) => ({
        ...it,
        state: it.id === playingKey ? "play" : "pause",
      })),
    }));
  }, [baseGroups, playingKey]);

  // 액션 (재생/정지)
  const handleAction = (it) => {
    setPlayingKey((prev) => {
      const next = prev === it.id ? null : it.id;
      if (next) {
        setSelectedStep(it);
        setModalOpen(true);
      } else {
        setModalOpen(false);
      }
      return next;
    });
  };

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
                  <TodayStepsList items={g.items} onAction={handleAction} />
                </SheetListSection>
              ))}
            </ScrollArea>
          </SheetBody>
        ) : (
          <Title className="typo-h3">우물 밖으로 나갈 준비</Title>
        )}
      </BottomSheet>

      {/* 패널 밖(뷰포트)에 고정된 화살표 */}
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
        onClose={() => setModalOpen(false)}
        title={data?.title ?? "목표"}
        step={selectedStep}
        isPlaying={!!playingKey}
      />
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
  background: transparent;
  border-bottom: 1px solid var(--bg-2);
`;

const TopRow = styled.div`  
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
  &:hover {
    background: var(--text-w2);
  }
`;

const ScrollArea = styled.div`
  overflow: auto;
  padding: 4px 8px 12px;
`;

const FloatingArrow = styled.img`
  position: fixed; left: 50%; transform: translateX(-50%);
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

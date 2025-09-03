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

export default function TodayStepsSheet({ todoId }) {
  const [open, setOpen] = React.useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [selectedStep, setSelectedStep] = React.useState(null);

  // 부모에서 내려준 id 사용(+ 폴백)
  const targetId = React.useMemo(
    () => (todoId ?? homeGoals?.contents?.[0]?.id ?? null),
    [todoId]
  );

  // mocks 기반 데이터 선택
  const data = React.useMemo(
    () => (targetId != null ? selectStepsByGoalId(homeGoals, targetId) : null),
    [targetId]
  );

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

    //steps 중 미래가 수행 예정 날짜인 경우를 제외 
    const nonFuture = steps.filter((s) => !isFuture(s.stepDate));
    // 오늘과 정확히 일치 
    const prepItems = nonFuture
      .filter((s) => isToday(s.stepDate))
      .map(toPausedItem("prep"));
    // 과거) 오늘 할 일은 아니지만, 미뤄져서 오늘 해야 함
    const carriedItems = nonFuture
      .filter((s) => !isToday(s.stepDate))
      .map(toPausedItem("carried"));

    return [
      { id: "prep", title: "우물 밖으로 나갈 준비", defaultOpen: true, items: prepItems },
      { id: "carried", title: "이월된 일", defaultOpen: true, items: carriedItems },
    ];
  }, [data]);

  // ===== 2) 토글/재생 정책 =====
  // 전역 1개만 play 가능. 다시 누르면 pause로.
  const [playingKey, setPlayingKey] = React.useState(null);

  // todoId 바뀌면 모두 pause로 초기화
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

  // const headerTitle = data?.title ?? "할 일 목록";

  const handleAction = (it) => {
    setPlayingKey((prev) => {
      const next = prev === it.id ? null : it.id;
      if (next) {
        // ▶️ play 전환 시: 모달 오픈 + 선택 스텝 저장 + (선택) 바텀시트 닫기
        setSelectedStep(it);
        setModalOpen(true);
        // closeSheet();
      } else {
        // ⏸ pause 전환 시: 모달 닫기
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
        size="56vh"
      >
        {open ? (
          <SheetBody>
            <TopBar>
              <CloseDownBtn onClick={closeSheet} aria-label="내려서 닫기">
                <img src={arrowDown} alt="arrow-down" width={14} style={{ height: "auto" }} />
              </CloseDownBtn>
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
          // <Title className="typo-h3">{headerTitle}</Title>
          <Title className="typo-h3">우물 밖으로 나갈 준비</Title>
        )}
      </BottomSheet>

      {/* 패널 밖(뷰포트)에 고정된 화살표: overflow 클리핑 영향 X */}
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
      // NavBar 보이게 하려면 주석 해제:
      // navOffset="calc(54px + 34px + env(safe-area-inset-bottom, 0px))"
      >
          {/* <h3 className="typo-h3" style={{ margin: 0, color: "var(--text-1)" }}>
            {data?.title ?? "목표"}
          </h3>
          <p style={{ margin: "6px 0 12px", color: "var(--text-2)" }}>
            선택한 스텝: <strong style={{ color: "var(--text-1)" }}>{selectedStep?.title ?? "-"}</strong>
          </p>
          <p style={{ margin: 0, color: "var(--text-2)" }}>
            진행 상태: <strong style={{ color: "var(--text-1)" }}>{playingKey ? "진행 중" : "일시정지"}</strong>
          </p> */}

      </DailyCheckInModal>
    </>
  );
}

/* ===================== styles ===================== */

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
  border-bottom: 1px solid var(--surface-2);
`;

const CloseDownBtn = styled.button`
  position: absolute;
  right: 8px;
  top: 6px;
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
    background: var(--surface-2);
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

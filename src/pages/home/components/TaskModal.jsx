import React from "react";
import styled from "styled-components";
import BottomSheet from "../../../layout/BottomSheet";
import arrowDown from "@/assets/images/arrow-down.svg";
import dragUp from "@/assets/images/drag-up.svg";
import ListSection from "./ListSection";
import TaskList from "./TaskList";

import homeGoals from "../store/todos.mock.json";
import { selectStepsByGoalId } from "../store/selectStepsByGoalId";

const PEEK_HEIGHT = 58; // 닫힘 상태에서 보일 높이 (BottomSheet의 peekHeight와 동일)

export default function TaskModal({ todoId }) {
  const [open, setOpen] = React.useState(false);
  const openSheet = () => setOpen(true);
  const closeSheet = () => setOpen(false);

  // ✅ 부모에서 내려준 id 사용(+ 폴백)
  const targetId = React.useMemo(
    () => (todoId ?? homeGoals?.contents?.[0]?.id ?? null),
    [todoId]
  );

  // ✅ steps.mocks.json 기반 데이터 선택
  const data = React.useMemo(
    () => (targetId != null ? selectStepsByGoalId(homeGoals, targetId) : null),
    [targetId]
  );

  // ✅ stepDate 기준 섹션 구성:
  // - 오늘/미래 => "우물 밖으로 나갈 준비"
  // - 과거      => "이월된 일"
  const { headerTitle, groups } = React.useMemo(() => {
    if (!data) {
      return {
        headerTitle: "할 일 목록",
        groups: [
          { id: "prep", title: "우물 밖으로 나갈 준비", defaultOpen: true, items: [] },
          { id: "carried", title: "이월된 일", defaultOpen: true, items: [] },
        ],
      };
    }

    const parseISODateLocal = (iso) => {
      if (!iso || typeof iso !== "string") return null;
      const [y, m, d] = iso.split("-").map(Number);
      if (!y || !m || !d) return null;
      return new Date(y, m - 1, d); // local midnight
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isSameOrFuture = (iso) => {
      const dt = parseISODateLocal(iso);
      if (!dt) return false; // 유효하지 않으면 과거 취급
      dt.setHours(0, 0, 0, 0);
      return dt.getTime() >= today.getTime();
    };

    const toItem = (prefix) => (s) => ({
      id: `${prefix}-${s.stepOrder ?? 0}`,
      title: s.description ?? "",
      state: s.isCompleted ? "idle" : "play",
    });

    const steps = Array.isArray(data.steps) ? data.steps : [];
    const prep = steps.filter((s) => isSameOrFuture(s.stepDate)).map(toItem("prep"));
    const carried = steps.filter((s) => !isSameOrFuture(s.stepDate)).map(toItem("carried"));

    return {
      headerTitle: data.title ?? "할 일 목록",
      groups: [
        { id: "prep", title: "우물 밖으로 나갈 준비", defaultOpen: true, items: prep },
        { id: "carried", title: "이월된 일", defaultOpen: true, items: carried },
      ],
    };
  }, [data]);

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
              <Title className="typo-h3">{headerTitle}</Title>
              <CloseDownBtn onClick={closeSheet} aria-label="내려서 닫기">
                <img src={arrowDown} alt="arrow-down" width={14} style={{ height: "auto" }} />
              </CloseDownBtn>
            </TopBar>

            <ScrollArea role="list">
              {groups.map((g) => (
                <ListSection key={g.id} title={g.title} defaultOpen={g.defaultOpen}>
                  <TaskList items={g.items} />
                </ListSection>
              ))}
            </ScrollArea>
          </SheetBody>
        ) : (
          <Title className="typo-h3">{headerTitle}</Title>
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

/** 화면(뷰포트)에 고정된 화살표 — 시트의 peek 위로 살짝 띄움 */
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

// src/pages/home/components/TodayStepsSheet.tsx
import styled from "styled-components";

import dragUp from "@/assets/images/drag-up.svg";
import type { StepListItem } from "@/pages/home/types/steps";

import { useOnbSheetStore } from "../store/useOnbSheetStore";
import OnbBottomSheet from "./OnbBottomSheet";
import OnbSheetListSection from "./OnbSheetListSection";

const todaySteps = [
  {
    key: "today",
    title: "오늘의 한 걸음",
    items: [
      {
        stepId: 6,
        stepOrder: 6,
        stepDate: "2025-11-08",
        description: "글 퇴고와 맞춤법 검사하기",
        isCompleted: false,
        state: "pause",
        id: 6,
      },
      {
        stepId: 5,
        stepOrder: 5,
        stepDate: "2025-11-08",
        description: "결론 작성하기",
        isCompleted: false,
        state: "pause",
        id: 5,
      },
      {
        stepId: 4,
        stepOrder: 4,
        stepDate: "2025-11-08",
        description: "본문 작성하기",
        isCompleted: false,
        state: "pause",
        id: 4,
      },
    ],
  },
  {
    key: "past",
    title: "놓친 한 걸음",
    items: [
      {
        stepId: 3,
        stepOrder: 3,
        stepDate: "2025-11-08",
        description: "서론+어린시절 작성하기",
        isCompleted: false,
        state: "pause",
        id: 3,
      },
      {
        stepId: 2,
        stepOrder: 2,
        stepDate: "2025-11-08",
        description: "자서전의 전체 흐름과 목차 결정하기",
        isCompleted: false,
        state: "pause",
        id: 2,
      },
      {
        stepId: 1,
        stepOrder: 1,
        stepDate: "2025-11-08",
        description: "자서전 경험 후보 정리하기",
        isCompleted: false,
        state: "pause",
        id: 1,
      },
    ],
  },
];

type StepsProps = {
  onAction?: (it: { id: number | null; stepId: number | null }) => void | Promise<void>;
  stageId?: string;
};

export default function OnbStepsSheet({ onAction, stageId }: StepsProps) {
  const open = useOnbSheetStore(s => s.open);
  return (
    <>
      {/* 온보딩 전용 BottomSheet는 showBackdrop prop이 없음 */}
      <OnbBottomSheet stageId={stageId}>
        {open ? (
          <SheetBody>
            <ScrollArea role="list">
              {todaySteps.map(group => (
                <OnbSheetListSection key={group.key} title={group.title}>
                  <OnbTodayStepsList items={group.items} onAction={onAction} />
                </OnbSheetListSection>
              ))}
            </ScrollArea>
          </SheetBody>
        ) : (
          <Title className="typo-h4">우물 밖으로 나갈 준비</Title>
        )}
      </OnbBottomSheet>
      {stageId === "sheet-scroll" && <FloatingArrow src={dragUp} alt="" aria-hidden="true" />}
    </>
  );
}

// --- 자식 컴포넌트도 그룹 아이템 배열로 받기 ---
function OnbTodayStepsList({
  items,
  onAction,
}: {
  items: StepListItem[];
  onAction?: (it: { id: number | null; stepId: number | null }) => void | Promise<void>;
}) {
  return (
    <List role="list">
      {items.map((it, idx) => (
        <Item key={it.stepId ?? `step-${idx}`} role="listitem">
          <Bullet aria-hidden="true" />
          <ItemTitle $completed={it.isCompleted}>{it.description}</ItemTitle>

          <Right>
            <ActionBtnWrapper
              onClick={() => void onAction?.({ id: it.stepId, stepId: it.stepId })}
              $isPlaying={false}
              $completed={it.isCompleted}
              $size={29}
            >
              <IconOuter data-property-1="기본">
                <IconSVG
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 21 21"
                  role="img"
                  aria-hidden="true"
                >
                  <path
                    d="M18.0693 10.4683C18.3338 10.6212 18.3338 11.0033 18.0693 11.1548L7.94731 16.9537C7.68358 17.1044 7.35478 16.9134 7.35454 16.6092L7.35454 4.95396C7.35473 4.64973 7.68355 4.46056 7.94731 4.61284L18.0693 10.4683Z"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </IconSVG>
              </IconOuter>
            </ActionBtnWrapper>
          </Right>
        </Item>
      ))}
    </List>
  );
}

/* ======================= styles ======================= */

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

const Title = styled.h3`
  margin: 4px 20px;
  color: var(--text-1);
`;

const List = styled.ul`
  list-style: none;
  display: grid;
  gap: 8px;
  margin-top: 4%;
  padding: 0;
  margin: 10px;
  background: transparent;
`;

const Item = styled.li`
  display: grid;
  grid-template-columns: 16px 1fr auto;
  align-items: center;
  gap: 3px;
  background: transparent;
  border-bottom: 1px solid var(--natural-400, #d6d9e0);
`;

const Bullet = styled.span`
  width: 4px;
  height: 4px;
  border-radius: 9999px;
  background: var(--icon-1);
  margin-right: 15px;
`;

const ItemTitle = styled.div<{ $completed?: boolean }>`
  color: var(--text-1, #000);
  font-size: 14px;
  font-weight: 400;
  line-height: 1.1;
  letter-spacing: var(--ls-2, 0);
  word-break: keep-all;
  overflow-wrap: anywhere;
  white-space: normal;

  ${({ $completed }) =>
    $completed &&
    `
      text-decoration: line-through;
      color: var(--text-2);
    `}
`;

const Right = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`;

const ActionBtnWrapper = styled.button<{
  $isPlaying?: boolean;
  $completed?: boolean;
  $size?: number;
}>`
  all: unset;
  cursor: pointer;

  display: inline-flex;
  border-radius: 16px;
  width: ${({ $size }) => $size ?? 29}px;
  height: ${({ $size }) => $size ?? 29}px;

  color: ${({ $completed }) => ($completed ? "red" : "var(--green-400)")};
`;

const IconOuter = styled.div`
  width: 80%;
  height: 80%;
  background: var(--natural-200);
  border-radius: 16px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
`;

const IconSVG = styled.svg`
  width: 18px;
  height: 18px;
`;

const FloatingArrow = styled.img`
  position: absolute;
  transform: translateX(-50%);
  bottom: calc(env(safe-area-inset-bottom, 0px) + 160px);
  width: 14px;
  height: auto;
  pointer-events: none;
  z-index: 5;
`;
